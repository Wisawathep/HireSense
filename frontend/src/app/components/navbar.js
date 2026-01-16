"use client";
import React, { useState } from 'react';
import { FileUser } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="shadow-md fixed top-0 left-0 w-full z-50" style={{backgroundColor: "rgb(0, 0, 0)"}}>
            <div className="px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-black">HireSense</div>

                <div className="flex space-x-6 items-center">
                <Link href="/">
                    <button className="hover:text-[#eb4446] font-medium transition-colors duration-200">
                    Home
                    </button>
                </Link>

                <Link href="/search">
                    <button className="hover:text-[#eb4446] font-medium transition-colors duration-200">
                    Search
                    </button>
                </Link>
                </div>
            </div>
        </nav>
  );
}