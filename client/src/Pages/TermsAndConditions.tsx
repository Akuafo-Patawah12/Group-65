import React from "react";
import { Button } from "antd";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="  py-12  bg-stone-100 text-gray-800 ">
      <div className="fixed top-0 w-full h-[60px] z-10 bg-white backdrop-blur-md shadow-md flex items-center justify-between px-8">
          <div className="flex justify-center items-center">
            <img src="/truck.jpg" alt="logo" className="w-[70px]"/>
        <h3 style={{transform:"translateY(5px)"}} className="text-xl italic font-bold text-gray-800 tracking-wide leading-1 ">AR Transport</h3>
        </div>
        <Button className="text-sm text-white h-full px-3 bg-blue-500 hover:text-blue-800 transition-all duration-200">
          Terms & Conditions
        </Button>
      </div>

    <div style={{marginInline:"auto",marginTop:"70px"}} className="w-[95%] bg-white px-4 py-5 md:w-4/5">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 text-center mb-12">Last Updated: May 5, 2025</p>

      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Andy Transport Attendance System, you acknowledge that you have read,
            understood, and agreed to be bound by these Terms and our Privacy Policy.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">2. User Eligibility</h2>
          <p>
            Only authorized employees, clerks, and administrators of Andy Transport are permitted to use this system.
            Unauthorized access is strictly prohibited and may result in disciplinary or legal action.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and truthful attendance data.</li>
            <li>Not impersonate another employee or falsify data.</li>
            <li>Maintain the confidentiality of your login credentials.</li>
            <li>Report technical issues or suspicious activity promptly.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">4. Data Collection and Usage</h2>
          <p>
            We collect data like GPS location, device info, and attendance timestamps for internal attendance and
            payroll purposes. See our Privacy Policy for more details.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">5. Location Accuracy</h2>
          <p>
            Our system attempts to capture accurate location data, but device and environmental factors may affect
            this accuracy.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">6. Restrictions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No tampering or unauthorized access.</li>
            <li>No automation tools or bots allowed.</li>
            <li>Do not misrepresent your location or shift data.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">7. System Availability</h2>
          <p>
            While we strive for 24/7 uptime, downtime may occur due to maintenance or technical issues. Andy Transport
            is not liable for any inconvenience.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">8. Modifications</h2>
          <p>
            We may update these Terms at any time. Continued use of the system means you accept the new version.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">9. Termination</h2>
          <p>
            Your access may be suspended or terminated if we detect any misuse or breach of these Terms.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">10. Contact Information</h2>
          <p>For inquiries, contact us at:</p>
          <ul className="list-none pl-0 mt-2 space-y-1">
            <li><strong>Email:</strong> support@AR Transport.com</li>
            <li><strong>Address:</strong> AR Transport HQ, Tema, Ghana</li>
          </ul>
        </section>
      </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
