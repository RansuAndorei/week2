import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { Star } from "@/components/Star/Star";

const Card = ({ id = undefined, image = "", title = "", rating = 1 }) => {
  return (
    <Link href={`/foods/${id}`}>
      <a className="block w-full">
        <div className="relative">
          <div className="overflow-hidden bg-gray-200 rounded-lg shadow aspect-w-16 aspect-h-9">
            {image ? (
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="transition hover:opacity-80"
                data-testid="cardImage"
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center w-full mt-2 font-semibold leading-tight text-gray-700">
          <p data-testid="cardTitle">{title}</p>
          <span className="ml-2">
            <Star rating={rating} size={20} />
          </span>
        </div>
        <p className="mt-2"></p>
      </a>
    </Link>
  );
};

Card.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  guests: PropTypes.number,
  beds: PropTypes.number,
  baths: PropTypes.number,
  price: PropTypes.number,
};

export default Card;
