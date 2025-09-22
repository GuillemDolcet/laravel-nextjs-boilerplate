<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Repositories\ProvidersRepository;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    /**
     * Providers repository instance.
     *
     * @param ProvidersRepository $providersRepository
     */
    protected ProvidersRepository $providersRepository;

    /**
     * Class constructor.
     *
     * @return void
     */
    public function __construct(ProvidersRepository $providersRepository)
    {
        $this->providersRepository = $providersRepository;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Provider::defaults() as $name) {
            $this->providersRepository->create(['name' => $name]);
        }
    }
}
