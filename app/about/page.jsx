import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ReWear</h1>
            <p className="text-xl max-w-3xl">We're on a mission to reduce textile waste and promote sustainable fashion through community-based clothing exchange.</p>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                ReWear was founded with a simple yet powerful idea: to create a community where people can exchange clothing they no longer wear, giving each garment a second life and reducing the environmental impact of fashion.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                The fashion industry is one of the largest polluters globally, with millions of tons of clothing ending up in landfills each year. We believe that by creating a platform for direct exchanges and a points-based redemption system, we can help reduce waste while building a community around sustainable fashion choices.
              </p>
              <p className="text-lg text-gray-600">
                Our goal is to make sustainable fashion accessible, convenient, and enjoyable for everyone.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image 
                src="/placeholder-image.svg" 
                alt="People exchanging clothing items"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How ReWear Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-green-100 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">List Your Items</h3>
                <p className="text-gray-600">
                  Upload photos and details of clothing items you no longer wear but are still in good condition. Each approved item earns you points.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-green-100 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse & Choose</h3>
                <p className="text-gray-600">
                  Explore items from other community members. When you find something you like, you can request a direct swap with one of your items or redeem it using your points.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-green-100 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exchange & Enjoy</h3>
                <p className="text-gray-600">
                  Once a swap is agreed upon or a redemption is confirmed, arrange to exchange the items. Give your "new" clothes a second life while reducing waste!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Environmental Impact */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Environmental Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
              <p className="text-gray-600">Items Exchanged</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
              <p className="text-gray-600">Active Members</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">5,000kg</div>
              <p className="text-gray-600">Textile Waste Saved</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">12,500kg</div>
              <p className="text-gray-600">CO₂ Emissions Reduced</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Every item exchanged on ReWear helps reduce the demand for new clothing production, saving water, reducing chemical use, and decreasing carbon emissions.
            </p>
            
            <Button href="/browse">
              Start Swapping Today
            </Button>
          </div>
        </div>
        
        {/* Team */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image 
                    src="/placeholder-image.svg" 
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image 
                    src="/placeholder-image.svg" 
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Michael Chen</h3>
                <p className="text-gray-600">Head of Operations</p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image 
                    src="/placeholder-image.svg" 
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Aisha Patel</h3>
                <p className="text-gray-600">Community Manager</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Join Us CTA */}
        <div className="bg-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Be part of the sustainable fashion movement. Start exchanging clothes, reducing waste, and refreshing your wardrobe without harming the planet.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button href="/auth/register" className="bg-white text-green-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
              <Button href="/browse" variant="outline" className="border-white text-white hover:bg-green-700">
                Browse Items
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}