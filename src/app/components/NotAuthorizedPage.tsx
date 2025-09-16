import Image from "next/image";
import React from "react";
import image from "@/app/unauth.png";
import Link from "next/link";

const NotAuthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-800 text-white px-4">
      <Image
        alt="Unauthorized access"
        src={image}
        width={300}
        height={300}
        className="object-contain mb-6"
      />

      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>

      <p className="text-lg text-gray-300 mb-6">
        You don’t have permission to view this page.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotAuthorizedPage;
