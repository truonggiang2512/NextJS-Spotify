"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import PlayButton from "./PlayButton";

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  console.log({ data });
  const imagePath = useLoadImage(data);
  console.log({ imagePath });
  return (
    <div
      onClick={() => onClick(data.id)}
      className="
  relative
  group
  flex
  flex-col
  items-center
  rounded-md
  overflow-hidden
  gap-x-4
  bg-neutral-400/5
  cursor-pointer
  transition
  p-3
  "
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover"
          src={imagePath || "/images/liked.png"}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">{data.title}</p>
        <p className=" text-neutral-400 pb-4 truncate w-full">
          By {data.author}
        </p>
      </div>
      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
