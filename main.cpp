#include <iostream>
#include "boids.cpp"
#include <ctime>
#include <cstdlib>

int main()
{
    std::srand(time(0));

    int count = 24;
    Boids boids(count);

    for (int i = 0; i < count; i++)
    {
        Boid b = boids.get_boid(i);
        vec3 pos = boids.get_position(boids.get_position_index(b));
        printf("%2d ", pos.x);
        printf("%2d ", pos.y);
        printf("%2d ", pos.z);
        printf("\n");
    }

    return 0;
}