#include <cstdint>

typedef uint8_t byte;

struct Boid
{
    byte info[7];
};

struct vec3{
    // TODO: THIS IS TEMPORARY FOR NOW!!!
};

class Boids
{
    private:
        // Boid array
        int count;
        Boid* boids;

        // Steering Metrics
        float seperation;
        float alignment;
        float cohesion;

        // Neighbourhood Variables
        float angle;
        float distance;
    public:
        Boids(int count);
        ~Boids();

        // Readout Boid information
        unsigned int get_position_index(Boid& boid);
        unsigned int get_velocity_index(Boid& boid);
        unsigned int get_offset(Boid& boid);

        // Boid creation
        Boid create_boid(vec3& position, vec3& velocity, unsigned int offset);
};