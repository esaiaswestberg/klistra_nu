#!/bin/bash

# Exit on error
set -e

echo "Generating API types..."

# Generate backend Go code
oapi-codegen -package api -generate types,gin openapi.yaml > backend/api/api.gen.go
echo "✓ Backend API generated"

# Generate frontend TypeScript types
npx openapi-typescript openapi.yaml -o frontend/src/api-types.ts
echo "✓ Frontend API generated"

echo "Generation complete!"
