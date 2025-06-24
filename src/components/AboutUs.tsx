
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Target, Heart } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  designation: string;
  image: string;
  bio: string;
  specialties: string[];
}

const AboutUs = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sujan Nepal',
      designation: 'Founding Managing Director',
      image: 'https://media.licdn.com/dms/image/v2/C5603AQGQ5J7HN3MfUg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1650214326462?e=1756339200&v=beta&t=acE9sY1V1Obh6Xkto8wE61R1-aOHQWmFw2XbhkPtYf4',
      bio: 'With over 10 years in hospitality management, Sujan leads our team with passion for excellence.',
      specialties: ['Leadership', 'Operations', 'Customer Service']
    },
    {
      id: '2',
      name: 'Sujit Karki',
      designation: 'Founding Director/Head Chef',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQESz7RWU-rbUg/profile-displayphoto-shrink_800_800/B4DZUI.X5GG4Ac-/0/1739612323935?e=1756339200&v=beta&t=_KaNTDqcROr8XKDdPy4Rbvqv7NEGs-LZifYHwh74itY',
      bio: 'Sujit brings 5 years of culinary expertise, crafting exceptional meals for our guests.',
      specialties: ['Culinary Arts', 'Menu Development', 'Sustainability']
    },
    {
      id: '3',
      name: 'Bishnu Pokhrel',
      designation: 'Founding Director/EV Technical Specialist',
      image: 'https://drive.google.com/file/d/1l8a_UKInF5fO0aV9d9ub_2pC6zEtNCx5/view?usp=sharing',
      bio: 'Bishnu ensures our charging infrastructure operates at peak performance 24/7.',
      specialties: ['EV Technology', 'Electrical Systems', 'Innovation']
    }
  ]);

  const companyValues = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leading the way in sustainable energy solutions and hospitality excellence'
    },
    {
      icon: Heart,
      title: 'Sustainability',
      description: 'Committed to environmental responsibility and green energy practices'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building connections and supporting the EV community'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Delivering exceptional service and premium experiences'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800 text-sm font-medium">About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Energy Palace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about creating the future of sustainable transportation and exceptional hospitality
          </p>
        </div>

        {/* Company Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white mb-12">
            <h3 className="text-3xl font-bold mb-6">Our Story</h3>
            <p className="text-lg leading-relaxed mb-6">
              Energy Palace was born from a vision to revolutionize the EV charging experience. We recognized that 
              charging your electric vehicle shouldn't be just about plugging in – it should be an opportunity to 
              relax, recharge yourself, and enjoy premium amenities.
            </p>
            <p className="text-lg leading-relaxed">
              Founded in 2024, we've combined cutting-edge charging technology with exceptional hospitality to create 
              a destination that serves both your vehicle and your well-being. Our state-of-the-art facility features 
              high-speed charging stations alongside a premium restaurant and coffee shop, making every visit a 
              delightful experience.
            </p>
          </div>

          {/* Company Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {companyValues.map((value, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated professionals are committed to providing exceptional service and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {employees.map((employee) => (
              <Card key={employee.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={employee.image} 
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{employee.name}</h4>
                  <p className="text-emerald-600 font-semibold mb-3">{employee.designation}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{employee.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {employee.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
