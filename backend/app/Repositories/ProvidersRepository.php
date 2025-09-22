<?php

namespace App\Repositories;

use App\Models\Provider;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;

class ProvidersRepository extends Repository
{
    /**
     * The actual model class supporting the business logic.
     */
    public function getModelClass(): string
    {
        return Provider::class;
    }

    /**
     * *All* providers query context.
     */
    public function allContext(array $options = []): Builder
    {
        return $this->applyBuilderOptions($this->newQuery(), $options)->orderBy('id');
    }

    /**
     * Get *all* providers from the database.
     *
     * @return Collection<int,Provider>
     */
    public function all(array $options = []): Collection
    {
        return $this->allContext($options)->get();
    }

    /**
     * Instantiates a new Provider object.
     */
    public function build(array $attributes = []): Provider
    {
        return $this->make($attributes);
    }

    /**
     * Creates a Provider instance.
     */
    public function create(array $attributes = []): ?Provider
    {
        return $this->update($this->build(), $attributes);
    }

    /**
     * Listing result set.
     */
    public function listing(Builder $context, array $options = []): LengthAwarePaginator
    {
        $options = array_merge(['per_page' => 30], $options);

        return $context->paginate($options['per_page']);
    }

    /**
     * Updates a provider instance.
     */
    public function update(Provider $instance, array $attributes = []): ?Provider
    {
        $instance->fill($attributes);

        $result = $instance->save();

        if (! $result) {
            return null;
        }

        return $instance;
    }

    /**
     * Gets or creates a Provider model instance.
     */
    public function firstOrCreate(array $attributes = [], array $where = ['email']): ?Provider
    {
        $findBy = Arr::only($attributes, $where);

        if ($instance = $this->findBy($findBy)) {
            return $instance;
        }

        return $this->create($attributes);
    }
}
