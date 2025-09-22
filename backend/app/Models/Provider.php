<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    public const PROVIDER_GOOGLE = 'google';

    public const PROVIDER_GITHUB = 'github';

    public static function defaults(): array
    {
        return [
            self::PROVIDER_GOOGLE,
            self::PROVIDER_GITHUB,
        ];
    }

    // /// Relations //////////////////////////////////////////////////////////////////////////////////////////////////

    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this
            ->belongsToMany(User::class, 'user_providers', 'provider_id', 'user_id')
            ->withPivot(
                [
                    'provider_account_id',
                    'access_token',
                    'refresh_token',
                    'expires_at',
                ]
            );
    }
}
