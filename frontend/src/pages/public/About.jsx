import { useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, Button } from '../../components/common';
import { ROUTES } from '../../utils/constants';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Organization-Based Communities',
      description: 'Connect with verified members from your university, company, or institution. Build authentic communities around shared interests and goals.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Verified Membership',
      description: 'Ensure content authenticity through our verification system. Only verified members from organizations can create and share content.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Powerful Publishing Tools',
      description: 'Create beautiful blog posts with our rich text editor, add images, format content, and organize posts with tags and categories.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Engagement Features',
      description: 'Like, comment, and interact with posts. Follow topics and authors that interest you. Build meaningful connections within your community.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Department Structure',
      description: 'Organize content by departments within organizations. Easily discover relevant posts and connect with peers in specific areas.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Admin Controls',
      description: 'Multi-level administration system with super admins, organization admins, and department admins to manage content and members effectively.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const team = [
    {
      name: 'Built for Education',
      role: 'Universities & Schools',
      description: 'Perfect for educational institutions to facilitate student engagement, share research, and build academic communities.',
    },
    {
      name: 'Enterprise Ready',
      role: 'Companies & Organizations',
      description: 'Enable internal knowledge sharing, company updates, and team collaboration within your organization.',
    },
    {
      name: 'Community Focused',
      role: 'Non-Profits & Groups',
      description: 'Build engaged communities around causes, interests, and missions that matter to your members.',
    },
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'We believe in real connections between real people. Our verification system ensures content comes from authentic community members.',
    },
    {
      title: 'Community First',
      description: 'Organizations and communities are at the heart of what we do. We build tools that bring people together meaningfully.',
    },
    {
      title: 'Privacy & Security',
      description: 'Your data and content are protected. We take privacy seriously and give you control over your information.',
    },
    {
      title: 'Simplicity',
      description: 'Powerful features don\'t have to be complicated. We design tools that are intuitive and easy to use.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20 lg:py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About Our Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're building the future of organization-based blogging. A platform where verified communities come together to share knowledge, stories, and ideas.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-xl text-gray-600">
                Empowering organizations to build authentic, engaged communities through verified blogging
              </p>
            </div>

            <Card className="bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We believe that the best content comes from verified, authentic voices within communities. 
                  Our platform is designed specifically for universities, companies, and organizations that want 
                  to facilitate meaningful engagement among their members.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Unlike traditional blogging platforms, we focus on organization-based communities where 
                  members are verified, content is authentic, and engagement is purposeful. Whether you're a 
                  student sharing research, an employee discussing industry trends, or a community member 
                  advocating for change, we provide the tools to make your voice heard.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with the needs of organizations and communities in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600">
              Designed for diverse organizations and communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((item, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {item.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              Principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Organizations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2K+</div>
              <div className="text-gray-600">Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Blog Posts</div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build Your Community?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of organizations already using our platform to engage their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.ORGANIZATIONS)}
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Explore Organizations
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default About;