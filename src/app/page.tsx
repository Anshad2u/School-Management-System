'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, CreditCard, BookOpen as BookOpenIcon, Moon, Star, Heart, Shield, Clock, MapPin, Phone, Mail, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-gray-900">Gem Stone Salafi School</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
          <div className="absolute top-40 right-40 w-48 h-48 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-emerald-100 text-sm font-medium">Nurturing Hearts &amp; Minds Since 2024</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Building Tomorrow&apos;s Leaders<br />
              <span className="text-amber-300">Through Islamic Education</span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
              A trusted Salafi institution providing authentic Islamic education alongside modern academics for children ages 6-14. Rooted in Quran and Sunnah, guided by the understanding of the Pious Predecessors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 px-8 h-12 text-base font-semibold shadow-xl">
                  Enroll Now <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base">
                  Access Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">200+</div>
              <div className="text-sm text-gray-500 mt-1">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">15+</div>
              <div className="text-sm text-gray-500 mt-1">Qualified Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">10+</div>
              <div className="text-sm text-gray-500 mt-1">Subjects Offered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">98%</div>
              <div className="text-sm text-gray-500 mt-1">Parent Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Gem Stone Salafi School?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We combine authentic Islamic teachings with quality modern education to develop well-rounded Muslim children.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpenIcon,
                title: "Quran & Tajweed",
                description: "Systematic Quran memorization and recitation with proper Tajweed rules under qualified Huffaz.",
                color: "bg-emerald-100 text-emerald-600"
              },
              {
                icon: Moon,
                title: "Authentic Aqeedah",
                description: "Teaching pure Islamic monotheism based on Quran, Sunnah, and the understanding of the Salaf us-Salih.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Star,
                title: "Modern Academics",
                description: "Comprehensive curriculum covering Mathematics, Science, English, and Social Studies aligned with standards.",
                color: "bg-amber-100 text-amber-600"
              },
              {
                icon: Heart,
                title: "Character Development",
                description: "Focus on Islamic manners, ethics, and moral values to build responsible and compassionate Muslims.",
                color: "bg-rose-100 text-rose-600"
              },
              {
                icon: Shield,
                title: "Safe Environment",
                description: "A nurturing, secure space where children learn and grow with proper supervision and care.",
                color: "bg-purple-100 text-purple-600"
              },
              {
                icon: Clock,
                title: "Flexible Timings",
                description: "Convenient school hours designed to accommodate both Islamic and academic learning schedules.",
                color: "bg-teal-100 text-teal-600"
              }
            ].map((feature, i) => (
              <Card key={i} className="border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Curriculum</h2>
              <p className="text-lg text-gray-500 mb-8">A balanced approach that integrates Islamic sciences with modern academics, ensuring students excel in both deen and dunya.</p>
              <div className="space-y-4">
                {[
                  { category: "Islamic Studies", subjects: "Quran, Hadith, Fiqh, Aqeedah, Arabic, Seerah" },
                  { category: "Sciences", subjects: "Mathematics, Physics, Chemistry, Biology" },
                  { category: "Languages", subjects: "English Language, Arabic Language, Urdu" },
                  { category: "Social Studies", subjects: "History, Geography, Civics" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.category}</h4>
                      <p className="text-sm text-gray-500">{item.subjects}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-white">
              <div className="text-center">
                <div className="text-6xl mb-6">📖</div>
                <blockquote className="text-xl sm:text-2xl font-medium italic mb-4">
                  &quot;The best of you are those who learn the Quran and teach it.&quot;
                </blockquote>
                <p className="text-emerald-200">— Prophet Muhammad (peace be upon him)</p>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-emerald-100 text-sm">Grades Available</p>
                  <p className="text-3xl font-bold mt-1">1st — 8th Grade</p>
                  <p className="text-emerald-200 text-sm mt-1">Ages 6 to 14 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Begin Your Child&apos;s Journey?</h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">Join our community of families committed to providing their children with an education rooted in Islamic values and academic excellence.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 text-base font-semibold">
                Create Account <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                Already a Member? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="text-white font-bold">Gem Stone Salafi School</span>
              </div>
              <p className="text-sm leading-relaxed">Nurturing the next generation of Muslims with authentic Islamic knowledge and modern academic excellence.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Login Portal</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Register Now</Link></li>
                <li><Link href="/stories" className="hover:text-white transition-colors">School Stories</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> Gem Stone Salafi School Campus</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> +91 XXXXX XXXXX</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> info@gemstonesalafi.edu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Gem Stone Salafi School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Dashboard() {
  const { user, userRole } = useAuth()
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    feeCollection: 0,
  })

  useEffect(() => { 
    if (['staff', 'principal', 'admin'].includes(userRole || '')) {
      fetchStats()
    }
  }, [userRole])

  const fetchStats = async () => {
    const { data: studentCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('role', 'student')

    const { data: teacherCount } = await supabase
      .from('teachers')
      .select('id', { count: 'exact' })

    const { data: courseCount } = await supabase
      .from('courses')
      .select('id', { count: 'exact' })

    const { data: feeCollection } = await supabase
      .from('fees')
      .select('amount')

    setStats({
      studentCount: studentCount?.length || 0,
      teacherCount: teacherCount?.length || 0,
      courseCount: courseCount?.length || 0,
      feeCollection: feeCollection ? feeCollection.reduce((sum, fee) => sum + Number(fee.amount || 0), 0) : 0,
    })
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Gem Stone Salafi School Dashboard</h1>
      {['staff', 'principal', 'admin'].includes(userRole || '') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students (6-14 yrs)</CardTitle>
              <Users size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <GraduationCap size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teacherCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courseCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
              <CreditCard size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.feeCollection.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {['staff', 'principal', 'admin'].includes(userRole || '') && (
              <>
                <Link href="/admissions">
                  <Button className="w-full">New Admission</Button>
                </Link>
                <Link href="/fees">
                  <Button className="w-full">Manage Fees</Button>
                </Link>
              </>
            )}
            <Link href="/courses">
              <Button className="w-full">View Subjects</Button>
            </Link>
            <Link href="/stories">
              <Button className="w-full">School Stories</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Islamic Education Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>📖 Quran Recitation with Tajweed</li>
              <li>🕌 Authentic Hadith Studies</li>
              <li>🕌 Islamic Studies & Character</li>
              <li>🕌 Arabic Language for Understanding</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}