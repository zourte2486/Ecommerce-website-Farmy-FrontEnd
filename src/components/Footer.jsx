import React from "react";
import { assets, footerLinks } from './../assets/assets';


const Footer = () => {
    const currentYear = new Date().getFullYear();
return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10 ">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
            <div>
                <img
                    className="w-34 md:w-32"
                    src={assets.logo}
                    alt="logo"
                />
                <p className="max-w-[410px] mt-6">
                    Welcome to GreenCart, your one-stop destination for fresh, organic groceries. 
                    We deliver handpicked fruits, vegetables, and daily essentials right to your doorstep, 
                    ensuring quality and freshness in every order.
                </p>
            </div>
            <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                {footerLinks.map((section, index) => (
                    <div key={index}>
                        <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                            {section.title}
                        </h3>
                        <ul className="text-sm space-y-1">
                            {section.links.map((link, i) => (
                                <li key={i}>
                                    <a href={link.url} className="hover:underline transition">
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
            Copyright {currentYear} © GreenCart All Right Reserved.
        </p>
    </div>
);
};

export default Footer;
