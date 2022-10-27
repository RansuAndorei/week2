import { StarIcon as StartSolid } from "@heroicons/react/solid";
import { StarIcon as StarOutline } from "@heroicons/react/outline";

export const Star = ({ rating, size }) => {
  let solid = 0;
  let outline = 0;
  const index = [0, 1, 2, 3, 4];

  return (
    <div
      className="flex items-center justify-center border-black-800"
      data-testid="ratings"
    >
      {index.map((index) => {
        if (rating - 1 >= index) {
          solid += 1;
          return (
            <StartSolid
              width={size}
              height={size}
              color="gold"
              key={index}
              data-testid={`solidStar${solid}`}
            />
          );
        } else {
          outline += 1;
          return (
            <StarOutline
              width={size}
              height={size}
              color="gray"
              key={index}
              data-testid={`outlineStar${outline}`}
            />
          );
        }
      })}
    </div>
  );
};
