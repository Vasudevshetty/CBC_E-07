import { useNavigate } from "react-router-dom";
import { features } from "../../data/ui";

function Features() {
  const navigate = useNavigate();
  return (
    <div className="py-10 px-4 md:px-10 lg:px-20 ">
      {/* Title */}
      <p className="bg-[#DDB900] w-max h-10 flex items-center px-6 text-2xl sm:text-3xl font-medium rounded-r-full">
        Features
      </p>

      {/* Feature Cards */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center md:items-stretch gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full md:w-1/4 h-72 p-4 text-black overflow-hidden cursor-pointer relative bg-white rounded-lg shadow-md flex flex-col justify-end transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: feature.color || "#fff" }}
            onClick={() => navigate(feature.navTo)}
          >
            <img
              src={feature.img}
              alt=""
              className="absolute top-0 right-0 w-32 h-auto"
            />
            <h3 className="text-2xl font-normal mb-2 z-10">{feature.title}</h3>
            <p className="text-sm z-10">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
