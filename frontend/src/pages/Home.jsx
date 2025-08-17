import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSearch } from '../context/SearchContext';

const categories = [
  { name: 'rajma', image: '/rajma.webp' },
  { name: 'ghee', image: '/ghee.png' },
  { name: 'rajma', image: '/rajma.webp' },
  { name: 'pickle', image: '/ghee.png' },
  { name: 'rajma', image: '/rajma.webp' },
  { name: 'ghee', image: '/ghee.png' },
  { name: 'rajma', image: '/rajma.webp' },
  { name: 'ghee', image: '/ghee.png' },
];

const heroImages = ['/hero1.png', '/hero2.png'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { searchTerm } = useSearch();
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

useEffect(() => {
  let filtered = products;

  if (selectedCategory) {
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredProducts(filtered);
}, [searchTerm, selectedCategory, products]);

  const handleCategoryClick = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 6,
    autoplay: true,
    arrows: true,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="text-gray-800 overflow-hidden ">
      {/* Hero Slider */}
      <section className="relative">
        <Slider {...heroSettings}>
          {heroImages.map((img, i) => (
            <div key={i} className="relative h-[300px] md:h-[450px] w-full">
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-fit shadow-lg"
              />
              <div className="absolute bottom-6 left-40 flex gap-4">
                <Link
                  to="/about"
                  className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-gray-100"
                >
                  About Us →
                </Link>
                <Link
                  to="/products"
                  className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-green-700"
                >
                  Products →
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Category Slider */}
      <section className="pt-4 pl-10 pr-10 px-4 bg-[#800000] text-white shadow-lg border-b border-gray-200">
        <Slider {...categorySettings}>
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`text-center p-4 cursor-pointer transition-transform duration-300 hover:scale-105 ${
                selectedCategory === cat.name ? 'bg-[#80000f] border-2 border-gray-200 rounded-xl ' : ''
              }`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="w-15 h-15 mx-auto rounded-full overflow-hidden border shadow-md mb-2">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-medium text-sm">{cat.name}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-8 bg-white max-w-8xl mx-auto">    
        <h2 className="text-2xl text-center font-semibold mb-8">
          {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found in this category.</p>
        )}
      </section>

      {/* Testimonials */}
      {/* <section className="bg-gray-50 py-12 px-6">
        <h2 className="text-2xl font-semibold text-center mb-8">What Our Customers Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="italic text-gray-700">"Fantastic quality products!"</p>
            <p className="font-semibold mt-2 text-green-700">— Asha</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="italic text-gray-700">"Fast delivery and fresh items."</p>
            <p className="font-semibold mt-2 text-green-700">— Ravi</p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
