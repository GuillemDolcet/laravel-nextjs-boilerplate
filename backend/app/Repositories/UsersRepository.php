<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;

class UsersRepository extends Repository
{
    /**
     * The actual model class supporting the business logic.
     */
    public function getModelClass(): string
    {
        return User::class;
    }

    /**
     * *All* users query context.
     */
    public function allContext(array $options = []): Builder
    {
        return $this->applyBuilderOptions($this->newQuery(), $options)->orderBy('id');
    }

    /**
     * Get *all* users from the database.
     *
     * @return Collection<int,User>
     */
    public function all(array $options = []): Collection
    {
        return $this->allContext($options)->get();
    }

    /**
     * Instantiates a new User object.
     */
    public function build(array $attributes = []): User
    {
        return $this->make($attributes);
    }

    /**
     * Creates a User instance.
     */
    public function create(array $attributes = []): ?User
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
     * Updates a user instance.
     */
    public function update(User $instance, array $attributes = []): ?User
    {
        $instance->fill($attributes);

        $result = $instance->save();

        if (! $result) {
            return null;
        }

        return $instance;
    }

    /**
     * Gets or creates a User model instance.
     */
    public function firstOrCreate(array $attributes = [], array $where = ['email']): ?User
    {
        $findBy = Arr::only($attributes, $where);

        if ($instance = $this->findBy($findBy)) {
            return $instance;
        }

        return $this->create($attributes);
    }

    /**
     * Finds a user by its email attribute.
     */
    public function findByEmail(string $email, array $options = []): ?User
    {
        return $this->findBy(['email' => $email], $options);
    }
}
