
import { useState, useEffect } from 'react';
import { getAboutUsContent, type AboutUsContent } from '@/services/aboutUsService';
import { useTheme } from '@/contexts/ThemeContext';

const AboutUs = () => {
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadAboutUsContent();
  }, []);

  const loadAboutUsContent = async () => {
    try {
      const data = await getAboutUsContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading About Us content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section id="about" className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>About Energy Palace</h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Welcome to Energy Palace - your destination for charging and dining.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{content.title}</h2>
          
          {content.company_story && (
            <div className="max-w-4xl mx-auto mb-12">
              <p className={`text-lg leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{content.company_story}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.mission_statement && (
              <div className={`p-8 rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-2xl font-bold text-emerald-600 mb-4">Our Mission</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{content.mission_statement}</p>
              </div>
            )}

            {content.vision_statement && (
              <div className={`p-8 rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{content.vision_statement}</p>
              </div>
            )}

            {content.values && content.values.length > 0 && (
              <div className={`p-8 rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Values</h3>
                <div className="space-y-3">
                  {content.values.map((value, index) => (
                    <div key={index}>
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{value.title}</h4>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {content.team_description && (
            <div className="mt-16 max-w-4xl mx-auto">
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Our Team</h3>
              <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{content.team_description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
