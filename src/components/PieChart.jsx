import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Chip
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
 
// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
 
const chartConfig = {
  type: "pie",
  width: 242,
  height: 242,
  series: [65, 35],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617", "#ff8f00"],
    legend: {
      show: false,
    },
  },
};
 
export default function PieChart({values}) {
  chartConfig.series = values;
  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
            Products Popularity
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal"
          >
            Visualization of products popularity with a pie chart, Orang stands for Quran and black stands for Books
          </Typography>
        </div>
      </CardHeader>
      <CardBody className=" grid place-items-center px-2">
        <Chart {...chartConfig} />
        <div className="flex gap-2">
          <Chip color="orange" value="Quran"/>
          <Chip color="gray" value="Books"/>
        </div>
      </CardBody>
    </Card>
  );
}