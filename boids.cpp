#include "boids.h"

Boids::Boids(int count) : count(count)
{
    boids = new Boid[count];
}

Boids::~Boids()
{
    delete[] boids;
}

unsigned int Boids::get_position_index(Boid& boid)
{
    unsigned int positionIndex = 0;
    positionIndex |= boid.info[0];
    positionIndex <<= 8;
    positionIndex |= boid.info[1];
    positionIndex <<= 8;
    positionIndex |= boid.info[2];

    return positionIndex;
}

unsigned int Boids::get_velocity_index(Boid& boid)
{
    unsigned int velocityIndex = 0;
    velocityIndex |= boid.info[3];
    velocityIndex <<= 8;
    velocityIndex |= boid.info[4];
    velocityIndex <<= 8;
    velocityIndex |= boid.info[5];

    return velocityIndex;
}

unsigned int Boids::get_offset(Boid& boid)
{
    unsigned int offset = boid.info[6];
    
    return offset;
}