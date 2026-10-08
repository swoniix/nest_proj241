import dataSource from '../data-source.js';
import { Country } from '../location/entities/country.entity.js';
import { City } from '../location/entities/city.entity.js';

interface ApiCountry {
  iso2: string;
  country: string;
  cities: string[];
}

interface ApiResponse {
  error: boolean;
  data: ApiCountry[];
}

const apiUrl = 'https://countriesnow.space/api/v0.1/countries';

async function getCountries(): Promise<ApiCountry[]> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse;
  if (result.error) {
    throw new Error('API returned an error');
  }

  return result.data;
}

async function seedLocations(): Promise<void> {
  await dataSource.initialize();

  try {
    const countryRepository = dataSource.getRepository(Country);
    const cityRepository = dataSource.getRepository(City);
    const countries = await getCountries();

    const countryMaxResult = await countryRepository
      .createQueryBuilder('country')
      .select('COALESCE(MAX(country.api_id), 0)', 'max')
      .getRawOne<{ max: string }>();
    const cityMaxResult = await cityRepository
      .createQueryBuilder('city')
      .select('COALESCE(MAX(city.api_id), 0)', 'max')
      .getRawOne<{ max: string }>();
    let nextCountryApiId = Number(countryMaxResult?.max ?? 0);
    let nextCityApiId = Number(cityMaxResult?.max ?? 0);

    for (const apiCountry of countries) {
      let country = await countryRepository.findOneBy({
        code: apiCountry.iso2,
      });

      if (!country) {
        country = await countryRepository.save(
          countryRepository.create({
            api_id: ++nextCountryApiId,
            name: apiCountry.country,
            code: apiCountry.iso2,
          }),
        );
      } else if (country.name !== apiCountry.country) {
        country.name = apiCountry.country;
        await countryRepository.save(country);
      }

      const savedCities = await cityRepository.find({
        where: { country: { id: country.id } },
        select: { name: true },
      });
      const savedCityNames = new Set(savedCities.map((city) => city.name));
      const cityNames = [...new Set(apiCountry.cities)].filter(
        (name) => !savedCityNames.has(name),
      );

      for (let i = 0; i < cityNames.length; i += 1000) {
        const part = cityNames.slice(i, i + 1000);
        await cityRepository.insert(
          part.map((name) => ({
            api_id: ++nextCityApiId,
            name,
            country,
          })),
        );
      }

      console.log(`${apiCountry.country}: ${cityNames.length} cities added`);
    }
  } finally {
    await dataSource.destroy();
  }
}

void seedLocations().catch((error: unknown) => {
  console.error('Failed to seed locations:', error);
  process.exitCode = 1;
});
