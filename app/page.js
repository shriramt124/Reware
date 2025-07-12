import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";

export default function Home() {
  // Sample featured items data
  const featuredItems = [
    {
      id: 1,
      title: "Denim Jacket",
      description: "Lightly worn denim jacket, perfect for fall weather",
      imageSrc: "/placeholder-image.svg",
    },
    {
      id: 2,
      title: "Summer Dress",
      description: "Floral pattern summer dress, worn only twice",
      imageSrc: "/placeholder-image.svg",
    },
    {
      id: 3,
      title: "Winter Sweater",
      description: "Warm wool sweater in excellent condition",
      imageSrc: "/placeholder-image.svg",
    },
    {
      id: 4,
      title: "Running Shoes",
      description: "Lightly used running shoes, size 9",
      imageSrc: "/placeholder-image.svg",
    },
  ];

  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 space-y-6">
                <Image 
                  src="/rewear-logo.svg" 
                  alt="ReWear Logo" 
                  width={200} 
                  height={60} 
                  priority 
                />
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Exchange Clothes,<br />
                  <span className="text-green-600">Reduce Waste</span>
                </h1>
                
                <p className="text-lg text-gray-600 max-w-lg">
                  Join our community clothing exchange platform and give your unused garments a second life while discovering unique pieces from others.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button href="/browse" size="lg">
                    Browse Items
                  </Button>
                  
                  <Button href="/auth/register" variant="outline" size="lg">
                    Start Swapping
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/placeholder-image.svg" 
                    alt="People exchanging clothes" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                ReWear makes it easy to exchange clothing items through direct swaps or our point-based system.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">List Your Items</h3>
                <p className="text-gray-600">Upload photos and details of clothing items you no longer wear.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse & Choose</h3>
                <p className="text-gray-600">Discover items from other users that match your style and needs.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Swap or Redeem</h3>
                <p className="text-gray-600">Request direct swaps or use points to redeem items you love.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Items Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Items</h2>
                <p className="mt-2 text-lg text-gray-600">Recently added clothing ready for exchange</p>
              </div>
              
              <Link 
                href="/browse" 
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={item.imageSrc} 
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">Available for swap</span>
                      <Link 
                        href={`/items/${item.id}`}
                        className="text-sm text-gray-600 hover:text-green-600"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Impact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Together, we're making a difference in reducing textile waste and promoting sustainable fashion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <p className="text-gray-700">Items Exchanged</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">300+</div>
                <p className="text-gray-700">Active Members</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">2,000 kg</div>
                <p className="text-gray-700">Textile Waste Saved</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Join the Movement?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Start exchanging your unused clothing items today and be part of the sustainable fashion revolution.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                href="/auth/register" 
                variant="secondary" 
                size="lg"
              >
                Sign Up Now
              </Button>
              
              <Button 
                href="/browse" 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-green-600"
              >
                Browse Items
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
     </>
  );
}
