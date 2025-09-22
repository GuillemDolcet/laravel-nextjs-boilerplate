<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BaseRequest extends FormRequest
{
    /**
     * Override the failed validation response.
     *
     * This will return a JSON response with:
     * - code: short identifier for the field and rule (e.g., email_required)
     * - message: descriptive error message
     *
     * @throws HttpResponseException
     */
    protected function failedValidation(Validator $validator): void
    {
        $errors = [];

        foreach ($validator->failed() as $field => $failedRules) {
            $messages = $validator->errors()->get($field);

            foreach ($messages as $message) {
                $rule = array_key_first($failedRules);

                $code = strtolower($field).'_'.strtolower($rule);

                $errors[$field][] = [
                    'code' => $code,
                    'message' => $message,
                ];
            }
        }

        throw new HttpResponseException(response()->json([
            'errors' => $errors,
        ], 422));
    }
}
