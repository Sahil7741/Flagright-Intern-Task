import React from 'react';
import MediaCard from '../components/MediaCard';
import ClientCard from '../components/ClientCard';
import CLIENTS  from '../constants/clients';
import BACKED_BY from '../constants/backedby';

const Home = () => {
  return (
    <>
    <div className='text-white my-16'>
        <div className='glass flex flex-col items-center justify-center max-w-3xl mx-auto p-8'>
            <h1 className='heading-neon text-5xl font-extrabold text-center mb-3'>Graph Explorer</h1>
            <p className='text-center text-lg text-gray-300'>Visualize relationships between users and transactions using a graph database. Explore at 100k+ scale with fast filters.</p>
        </div>
    </div>
    <div className='flex flex-col justify-center items-center mx-auto max-w-full'>
        <h1 className='text-white text-3xl my-4 font-bold'>Why this system?</h1>
        <div className="flex my-10 justify-evenly max-w-full flex-wrap gap-4">
          <MediaCard 
            title="User Behavior Analysis"
            content="Understand user behavior through transaction patterns."
            imgSrc="https://siterecording.com/images/blog/user-behavior-analysis-1.png?v=1687952985197898968"
          />
          <MediaCard
            title="Fraud Detection"
            content="Identify potential fraudulent activities in user transactions."
            imgSrc="https://a-us.storyblok.com/f/1012896/2667x1500/ae6762a0e1/fraud-detection-02.jpg"
          />
          {/* <MediaCard
            title="Personalized Recommendations"
            content="Provide personalized recommendations based on user behavior."
            imgSrc="/static/images/cards/contemplative-reptile.jpg"
          /> */}
        </div>
    </div>
    <div className='flex flex-col items-center justify-center my-10 text-white mx-auto'>
        <h1 className='text-4xl font-bold text-white my-4 w-2/3 text-center'>Trusted by financial institutions across 6 continents</h1>
        <div className='grid md:grid-cols-4 grid-cols-2 gap-4 justify-center items-center w-5/6 mx-auto'>
          {CLIENTS.map((client) => (
           <ClientCard key={client.name} client={client} />
          ))}
        </div>
        <p className='text-center text-lg my-4'>And More...</p>
    </div>
    <div className='flex flex-col items-center justify-center my-14 text-white mx-auto'>
        <h1 className='text-3xl font-bold text-white my-4 w-2/3 text-center'>Backed By</h1>
        <div className='w-2/3 flex mx-auto justify-evenly items-center gap-4'>
            {BACKED_BY.map((partner) => (
                <img src={partner.logo} alt={partner.name} className="w-1/6" key={partner.name} />
            ))}
        </div>
    </div>
    
    </>
  );
};

export default Home;
