import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, Users, BarChart3, Clock, DollarSign, TrendingUp, MessageSquare, UserCheck, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/scalewize_cover_logo.png" alt="ScaleWize AI Cover Logo" width={180} height={40} className="h-10 w-auto" priority />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#solutions" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Solutions
              </Link>
              <Link href="#results" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Results
              </Link>
              <Link href="#blog" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Blog
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Log In
              </Link>
              <Link href="#book-call" className="text-white px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#595F39' }}>
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #f8f7f4 0%, #f0ede8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI THAT
              <br />
              <span style={{ color: '#595F39' }}>WORKS</span>
              <br />
              FOR YOU
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              At ScaleWize AI, our mission is to simplify the power of artificial intelligence for our clients - 
              delivering tailored, human-centric solutions that save time, maximize operational efficiency, and 
              provide measurable results. Our commitment is to help clients navigate AI with confidence, driving 
              net-positive investment and sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#book-call" 
                className="text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center"
                style={{ backgroundColor: '#595F39' }}
              >
                Book a Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl text-gray-700 leading-relaxed">
            We put customers first, ensuring every journey is seamless, while offering innovative AI at a fraction of traditional costs.
          </p>
        </div>
      </section>

      {/* Time is Money Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f7f4' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            TIME IS
            <br />
            <span style={{ color: '#595F39' }}>MONEY,</span>
            <br />
            SAVE BOTH
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ScaleWize AI empowers clients to navigate AI with ease - delivering efficient, cost-effective solutions 
            and delightful customer experiences, always putting people first
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sales */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f0ede8' }}>
                <TrendingUp className="h-8 w-8" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sales</h3>
              <p className="text-gray-600 mb-4">
                AI-powered lead generation, customer insights, and sales automation to boost your revenue.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Lead scoring & qualification</li>
                <li>• Customer behavior analysis</li>
                <li>• Sales process optimization</li>
              </ul>
            </div>

            {/* Marketing */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f0ede8' }}>
                <MessageSquare className="h-8 w-8" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing</h3>
              <p className="text-gray-600 mb-4">
                Personalized campaigns, content optimization, and audience targeting for maximum engagement.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Content personalization</li>
                <li>• Campaign optimization</li>
                <li>• Audience segmentation</li>
              </ul>
            </div>

            {/* Operations */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f0ede8' }}>
                <Settings className="h-8 w-8" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Operations</h3>
              <p className="text-gray-600 mb-4">
                Streamlined workflows, process automation, and efficiency optimization for your business.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Workflow automation</li>
                <li>• Process optimization</li>
                <li>• Resource management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f7f4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              PROVEN
              <br />
              <span style={{ color: '#595F39' }}>RESULTS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI solutions deliver measurable outcomes that drive real business value
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0ede8' }}>
                <Clock className="h-10 w-10" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">40%</h3>
              <p className="text-gray-600">Time Saved</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0ede8' }}>
                <DollarSign className="h-10 w-10" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">60%</h3>
              <p className="text-gray-600">Cost Reduction</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0ede8' }}>
                <TrendingUp className="h-10 w-10" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3x</h3>
              <p className="text-gray-600">Efficiency Gain</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0ede8' }}>
                <Users className="h-10 w-10" style={{ color: '#595F39' }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="book-call" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            READY TO
            <br />
            <span style={{ color: '#595F39' }}>SCALE?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how AI can transform your business operations and drive sustainable growth.
          </p>
          <Link 
            href="/login" 
            className="text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center"
            style={{ backgroundColor: '#595F39' }}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image src="/scalewize_logo.png" alt="ScaleWize AI Logo" width={120} height={30} className="h-8 w-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Simplifying AI for businesses, delivering results that matter.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Sales AI</li>
                <li>Marketing AI</li>
                <li>Operations AI</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Ready to get started?<br />
                Let's talk about your AI needs.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 ScaleWize AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
