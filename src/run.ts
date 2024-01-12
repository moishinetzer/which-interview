type Heading = 'north' | 'east' | 'south' | 'west';
type Direction = 'forward' | 'left' | 'right';
type Coordinate = {
  x: number;
  y: number;
};
type Arena = {
  corner1: Coordinate;
  corner2: Coordinate;
};
type Status = 'ok' | 'error' | 'crash';

function isInsideArena(location: Coordinate, arena: Arena) {
  const { corner1, corner2 } = arena;

  const minX = Math.min(corner1.x, corner2.x);
  const maxX = Math.max(corner1.x, corner2.x);
  const isInsideX = location.x >= minX && location.x <= maxX;

  const minY = Math.min(corner1.y, corner2.y);
  const maxY = Math.max(corner1.y, corner2.y);
  const isInsideY = location.y >= minY && location.y <= maxY;

  // As long as the location is inside both the x and y axis, it's inside the arena
  return isInsideX && isInsideY;
}

function moveForward({ location, heading }: { location: Coordinate; heading: Heading }): Coordinate {
  const movements: { [key in Heading]: Coordinate } = {
    north: { x: 0, y: 1 },
    east: { x: 1, y: 0 },
    south: { x: 0, y: -1 },
    west: { x: -1, y: 0 },
  };
  return {
    x: location.x + movements[heading].x,
    y: location.y + movements[heading].y,
  };
}

function rotateRight({ heading }: { heading: Heading }): Heading {
  const headings: { [key in Heading]: Heading } = {
    north: 'east',
    east: 'south',
    south: 'west',
    west: 'north',
  };

  return headings[heading];
}

function rotateLeft({ heading }: { heading: Heading }): Heading {
  const headings: { [key in Heading]: Heading } = {
    north: 'west',
    east: 'north',
    south: 'east',
    west: 'south',
  };

  return headings[heading];
}

// Note: If input is not gaurenteed to be valid,
// we should use a validation library like Zod or Yup
export type Input = {
  arena: Arena;
  location: Coordinate;
  heading: Heading;
  directions: Direction[];
};

export type Result = {
  status: Status;
  location: Coordinate;
  heading: Heading;
  path: Direction[];
};
export function run(input: Input): Result {
  // eslint-disable-next-line prefer-const
  let { arena, location, heading, directions } = input;

  const path: Direction[] = [];
  let status: Status = 'ok';

  // For each direction:
  for (const direction of directions) {
    // Add the direction currently being processed to the path
    path.push(direction);

    // Process the step
    switch (direction) {
      case 'forward': {
        const newLocation = moveForward({ location, heading });

        if (!isInsideArena(newLocation, arena)) {
          status = 'crash';
        } else {
          location = newLocation;
        }
        break;
      }
      case 'left': {
        const newHeading = rotateLeft({ heading });
        heading = newHeading;
        break;
      }
      case 'right': {
        const newHeading = rotateRight({ heading });
        heading = newHeading;
        break;
      }
      default: {
        // This makes sure we always remember to add a new handler if the type of direction gets extended
        assertUnreachable(direction);
        status = 'error';
      }
    }

    // If there's an error, break out and set the status to "error"
    if (status === 'error' || status === 'crash') {
      break;
    }
  }

  const result: Result = {
    status,
    location,
    heading,
    path,
  };

  return result;
}

// This asserts that a given value is of type `never` and thus can never happen
export function assertUnreachable(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  x: never
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) {}
