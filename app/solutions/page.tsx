export default function SolutionsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solutions</h2>
        <p className="text-gray-600 mb-6">
          Big or small, customer-facing or internal, front-end, back-end, full stack, we've done it all. 
          Our solutions are designed to meet the unique needs of your business, leveraging the latest 
          technologies and best practices to deliver exceptional results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Fast Performance</h3>
            </div>
            <p className="text-gray-600">
              Effeciency is at the core of our solutions. We optimize for speed and performance, ensuring your websites 
              are snappy and responsive, your services process quickly and return outputs in a timely manner, and you're free 
              to get back to what matters most to you.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">No Maintenance</h3>
            </div>
            <p className="text-gray-600">
              We handle the heavy (and light) lifting, managing the code base and hosting so you can focus on your business. But, if 
              you'd rather own the output product than consume it as a service, we provide options for that as well.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Flexible Development</h3>
            </div>
            <p className="text-gray-600">
              Our focus is making sure you're comfortable with and included in our process as much as you want to be. 
              Whether through an agile approach, with iterative and flexible cycling, or an agreed upon devirable up front, 
              we're happy to work with you - however works best for you!
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Continuous Support</h3>
            </div>
            <p className="text-gray-600">
              We're here to help you every step of the way, from initial setup to ongoing support and enhancements. 
              Have a question? Need help with something? We're just a message away.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
        <p className="text-gray-600 mb-4">
          Contact our team to learn more about how our solutions can benefit your organization.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}