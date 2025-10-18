"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { localGeorama } from "../fonts";
import { localGotham } from "../fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const Footer = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
  <footer className="w-full bg-[#fafafa] mt-8 sm:mt-12 md:mt-16 lg:mt-20 pt-4 pb-2 text-neutral-700 text-sm">
    <div className="flex flex-col items-center gap-2 px-4 sm:px-0">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 mb-2">
        <Image src="/togahat.png" alt="CourseFinder Logo" width={28} height={28} className="sm:w-8 sm:h-8" />
        <span className={`text-[#A75F00] font-bold text-lg sm:text-xl tracking-wide uppercase ${localGotham.className}`}>CourseFinder</span>
      </div>
          {/* Navigation Links */}
          <nav className="flex flex-row gap-6 sm:gap-12 md:gap-16 lg:gap-25 mb-2 text-center justify-center">
            <Link href="/about" className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}>
              About Us
            </Link>
            <button 
              onClick={() => setShowTermsModal(true)}
              className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}
            >
              Terms of Use
            </button>
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className={`uppercase text-xs sm:text-sm font-bold hover:text-[#A75F00] transition-colors ${localGeorama.className}`}
            >
              Privacy Policy
            </button>
          </nav>
    </div>
    {/* Divider */}
    <hr className="border-t border-neutral-300 my-2 mx-4 sm:mx-0" />
    {/* Copyright */}
    <div className={`text-center text-xs text-neutral-500 pb-2 tracking-wide px-4 sm:px-0 ${localGeorama.className}`}>
      COPY RIGHT &copy; {new Date().getFullYear()}, COURSEFINDER. ALL RIGHTS RESERVED.
    </div>
  </footer>

      {/* Terms of Use Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`${localGotham.className} text-[#A75F00] text-xl`}>
              Terms of Use
            </DialogTitle>
            <DialogDescription className={`${localGeorama.className} text-[#294556]`}>
              Please read and acknowledge our terms of data usage
            </DialogDescription>
          </DialogHeader>
          <div className={`${localGeorama.className} text-sm text-[#294556] space-y-4`}>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Data Collection and Usage</h3>
              <p>
                By using CourseFinder, you acknowledge and agree that we collect and use your personal information, 
                including but not limited to your personality test responses, course preferences, and demographic data, 
                to provide personalized course and career recommendations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Purpose of Data Collection</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>To analyze your personality traits and learning preferences</li>
                <li>To recommend suitable academic courses and career paths</li>
                <li>To improve our recommendation algorithms and services</li>
                <li>To provide personalized user experiences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">User Consent</h3>
              <p>
                Your continued use of our platform constitutes your explicit consent to our data collection 
                and processing practices as outlined in these terms and our Privacy Policy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Academic Use</h3>
              <p>
                This platform is developed as part of a Capstone 2 Project at STI College Cubao. 
                Your data may be used for educational and research purposes related to this project.
              </p>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowTermsModal(false)}
              className="px-6 py-2 bg-[#A75F00] text-white rounded-md hover:bg-[#8B4F00] transition-colors"
            >
              I Acknowledge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`${localGotham.className} text-[#A75F00] text-xl`}>
              Privacy Policy
            </DialogTitle>
            <DialogDescription className={`${localGeorama.className} text-[#294556]`}>
              How we protect and handle your personal information
            </DialogDescription>
          </DialogHeader>
          <div className={`${localGeorama.className} text-sm text-[#294556] space-y-4`}>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Personal information (name, email, age, gender)</li>
                <li>Personality test responses and scores</li>
                <li>Course and career preferences</li>
                <li>Usage data and platform interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Data Protection</h3>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. Your data is stored securely 
                and accessed only by authorized personnel for legitimate purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Data Sharing</h3>
              <p>
                We do not sell, trade, or share your personal information with third parties for commercial 
                purposes. Data may be shared in aggregate, anonymized form for research and educational purposes 
                related to our academic project.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Your Rights</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your account and associated data</li>
                <li>Right to withdraw consent at any time</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#A75F00] mb-2">Contact Information</h3>
              <p>
                For questions about this Privacy Policy or your data, please contact us through our platform 
                or reach out to the development team at STI College Cubao.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="px-6 py-2 bg-[#A75F00] text-white rounded-md hover:bg-[#8B4F00] transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer; 