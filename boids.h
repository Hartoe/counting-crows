#include <cstdint>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <ctime>

typedef uint8_t byte;

struct Boid
{
    byte info[7];
    Boid(){}
    Boid(byte _info[7])
    {
        std::memmove(info, _info, sizeof(info));
    }
};

// TODO: THIS IS TEMPORARY FOR NOW, USE GLM OR OTHER LIB!!!
struct vec3{
    float x, y, z;

    vec3() : x(rand_range(-10, 10)), y(rand_range(-5, 5)), z(rand_range(0, 12)) { }
    vec3(float x, float y, float z) : x(x), y(y), z(z) { }

    int rand_range(int min, int max)
    {
        int range = max - min + 1;
        int num = (std::rand() % range) + min;
        return num;
    }
};

class Boids
{
    private:
        // Boid arrays
        int count;
        Boid* boids;
        vec3* positions;
        vec3* velocities;

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
        unsigned int get_position_index(Boid boid);
        unsigned int get_velocity_index(Boid boid);
        unsigned int get_offset(Boid boid);

        Boid get_boid(unsigned int index);
        vec3 get_position(unsigned int index);
        vec3 get_velocity(unsigned int index);

        // Boid creation
        Boid create_boid(unsigned int index, vec3 position, vec3 velocity, unsigned int offset);
        unsigned int bytes_to_int(byte* bytes, int size);
        byte* int_to_bytes(unsigned int value, int size);
};