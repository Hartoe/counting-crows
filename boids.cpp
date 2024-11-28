#include "boids.h"
#include <stdexcept>

#define IS_BIG_ENDIAN (!(union { uint16_t u16; unsigned char c; }){ .u16 = 1 }.c)

Boids::Boids(int count) : count(count)
{
    // Initialize lists
    boids = new Boid[count];
    positions = new vec3[count];
    velocities = new vec3[count];

    // Fill out lists with default values
    for (unsigned int i = 0; i < count; i++)
    {
        positions[i] = vec3();
        velocities[i] = vec3();
        create_boid(i, positions[i], velocities[i], 0);
    }
}

Boids::~Boids()
{
    delete[] boids;
    delete[] positions;
    delete[] velocities;
}

unsigned int Boids::get_position_index(Boid boid)
{
    return bytes_to_int(&(boid.info[0]), 3);
}

unsigned int Boids::get_velocity_index(Boid boid)
{    
    return bytes_to_int(&(boid.info[3]), 3);
}

unsigned int Boids::get_offset(Boid boid)
{
    return bytes_to_int(&(boid.info[6]), 1);
}

Boid Boids::create_boid(unsigned int index, vec3 position, vec3 velocity, unsigned int offset)
{
    positions[index] = position;
    velocities[index] = velocity;

    byte* index_bytes = int_to_bytes(index, 3);
    byte* offset_bytes = int_to_bytes(offset, 1);

    byte info[7] = { index_bytes[0], index_bytes[1], index_bytes[2], index_bytes[0], index_bytes[1], index_bytes[2], offset_bytes[0] };
    Boid boid(info);
    boids[index] = boid;
    
    return boid;
}

Boid Boids::get_boid(unsigned int index)
{
    if (index < 0 || index >= count)
        throw std::invalid_argument("Index not inside the range of the array!");

    return boids[index];
}
vec3 Boids::get_position(unsigned int index)
{
    if (index < 0 || index >= count)
        throw std::invalid_argument("Index not inside the range of the array!");

    return positions[index];
}
vec3 Boids::get_velocity(unsigned int index)
{
    if (index < 0 || index >= count)
        throw std::invalid_argument("Index not inside the range of the array!");

    return velocities[index];
}

unsigned int Boids::bytes_to_int(byte* bytes, int size)
{
    if (size > 4 || size <= 0){
        throw std::invalid_argument("Size must be between or equal to 1 and 4!");
    }

    unsigned int result = 0;

    for (int i = 0; i < size; i++)
    {
        result += (bytes[i] << (8*i));
    }

    return result;
}

byte* Boids::int_to_bytes(unsigned int value, int size)
{
    if (size > 4 || size <= 0){
        throw std::invalid_argument("Size must be between or equal to 1 and 4!");
    }

    byte* result = new byte[size];

    for (int i = 0; i < size; i++)
    {
        if (IS_BIG_ENDIAN)
            result[i] = value >> (24 - (8*i)) & 0xFF;
        else
            result[i] = value >> (8*i) & 0xFF;
    }

    return result;
}