# Database Schema

The PostgreSQL database consists of four primary models:

## Earth
Represents a specific universe in the multiverse.
- `id`: Primary Key (e.g., "earth-616")
- `designation`: Human-readable name (e.g., "Earth-616")
- `hex`: Color code used for rendering the branch in the 3D graph.

## Character
Represents a Spider-variant, ally, or villain.
- `id`: Primary Key
- `alias`: Superhero name (e.g., "Spider-Man")
- `name`: Secret identity
- `earthId`: Foreign Key linking to Earth

## TimelineEvent
Represents a significant comic run, movie, or crossover event.
- `id`: Primary Key
- `title`: Event title
- `year`: Chronological sorting value
- `participants`: Array of Character IDs involved in the event.

## Movie
Specifically tracks live-action films.
- `id`: Primary Key
- `title`: Movie title
- `releaseDate`: Theatrical release date