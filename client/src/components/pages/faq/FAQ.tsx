import { useState } from "react";
import styling from "./FAQ.module.css";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

const FAQ = () => {
  const faqDataCandidates = [
    {
      question: "What do I need to set up in my profile?",
      answer:
        "Set up your profile with your personal and professional information for recruiters to see your skills and values. At Bridge, we believe that skills are the most important aspect of your professional experience for recruiters to look at. That’s why we recommend that you add in as many skills as you can come up with. Next to that, most recruiters find it convenient to see where you are (willing to) live and what languages you speak. Also make sure to add some additional information, like your salary expectations and experience you’ve built up over the years.",
    },

    {
      question: "Why do I need to add in my values?",
      answer:
        "Many companies these days are looking for new talent that doens’t only match their required skills, but are also a culturally good fit. For this, companies work with their own values and belief systems, often employees get more recognition for following along these value systems. To also already do the first cultural check, Bridge has added this to your profile and to the profiles of the companies so that it can be compared. For you, it’s key to select the 5 most important values to you!",
    },
    {
      question: "What can recruiters see?",
      answer:
        "Bridge wants to fight the bias that happens when hiring and seeing candidate profiles for the first time. That’s why we don’t ask you to upload any picture and don’t even show your full name to recruiters, they just see your initials. " +
        "A lot of the personal information that you add in your profile will be hidden for recruiters until you accept their request to see it. This means that they have to select based on your skill set instead of your face, gender, or the university you went to.",
    },
    {
      question: "How does the matching work?",
      answer:
        "Bridge has an algorithmic matching mechanism that is based on the skills and values of candidates and the skills required for the job and the values of the company that posted the job. In this way, Bridge doesn't carry the same biases as some humans have, because it doesn't know the name, nationality or university degree of the candidates. The score that is shown for the matches is based mostly on the hard skills of the candidate and the rate that it matches with what is described in the job application. Secondly, the soft skills are taken into account, however they carry a little less weight than the hard skills. Lastly, the values are another factor of the matching percentage and they carry the lowest weight. So what does this mean for the score? Imagine the job asks for 5 hard skills, 6 soft skills and 4 values. The hard skills count for 1 and the soft skills and values count for 1/2, which means the total score of this job is 10. A candidate having all 5 hard skills already matches 50%, and gains more percentage points with some of the soft skills and values. A candidate having 5 soft skills or values doesn't get a matching rate of 50% because these criteria have a little less weight than the hard skills required for the job.",
    },
    {
      question: "What happens when I contact a recruiter?",
      answer:
        "You can browse for jobs and when you see one that you like, you can let the recruiter know you want to apply by sending over your personal information. Normally, recruiters can only see your public profile, with skills, values and languages, but in this case you can decide what else you want to share besides your contact details. Make sure you entice them to invite you for an interview!",
    },
    {
      question: "What happens when a recruiter wants to contact me?",
      answer:
        "Recruiters can also browse through candidate profiles and find their favorites. When a recruiter wants to contact a candidate, they have to request access to their personal information. The candidate sees a request coming in and gets to decide if they want to share their contact details and other parts of their more personal information with the recruiter. " +
        "Note that a recruiter cannot download any information from the platform. This is also to guarantee that a candidate's personal information stays in the platform. When an application is at hand, it is likely that a recruiter will ask again for the candidate’s CV for their own systems if necessary.",
    },
    {
      question: "Can I save my preferred jobs?",
      answer:
        "Yes! You will find a save button on all jobs, also in the overview. These jobs can be found back on the shortlist page.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, please go to your settings page on the sidebar. Once you request a removal of your account, Bridge will delete all your data. The action cannot be undone so in case you want to get back on the platform, an association will have to send you a new invite.",
    },
    {
      question: "Can I change my password?",
      answer: "Yes, please go to your settings page on the sidebar.",
    },
  ];

  const faqDataCompanies = [
    {
      question: "What is Bridge and why should I commit to this platform?",
      answer:
        "Bridge is a platform that connects new technical talent with recruiters from companies that are looking for fresh and diverse candidates. " +
        "Bridge is an invite only platform, which means that the only users of the platform are invited by associations that are working on diversification of the tech industry. " +
        "For candidates, the benefits are that they are already one step closer to companies and recruiters that might hire them. " +
        "For recruiters, the benefits are a curated pool of diverse talent for their tech jobs, to which they have exclusive access. " +
        "For the associations, the benefits are that they can go one step further than their bootcamps or hackathons and offer their participants real job opportunities.",
    },
    {
      question: "What do I need to set up my company profile?",
      answer:
        "As a platform where talented job seekers are actively browsing opportunities, it is key that you present your company in an attractive way! Fill in the basic information about who you are, what you do and what your culture is. On Bridge, we would like to focus on company values a little more than normally, so please make sure you have them ready to go online! After a full profile, you can also set up your job listings, where you can copy in the job descriptions you already have and add in a few more details that are necessary for the prospects to find your offers swiftly.",
    },
    {
      question: "Why do I need to add in the company values?",
      answer:
        "At Bridge, we believe that the best candidates also match well with the company culture. Therefore, we take into account the company and candidate values for our platform because we think it is important for a long term sustainable match that a candidate feels at home at a new company. Candidates can select the 5 most important values to them, which means they might have left out some that are important to you as a company. It means that candidates might have left out the ones that are important to your company. We recommend you have a look and use the values, however don’t let them determine your final judgment entirely.",
    },
    {
      question: "Why can I not find all the contact information of candidates?",
      answer:
        "Bridge is a platform that tries to fight biases in the job market. In able to do that, we removed all personal information from the public profile and ask you as a recruiter to solely base your initial judgment on the candidate’s skills and values. Once you decide that those are a match, you can request the candidate to send you their contact details and more information like their CV, certificates and other important information. Note that you can’t download any of this information, due to data privacy and security reasons. You are free to use their contact details to follow up outside of Bridge.",
    },
    {
      question: "How does the matching work?",
      answer:
        "Bridge has an algorithmic matching mechanism that is based on the skills and values of candidates and the skills required for the job and the values of the company that posted the job. In this way, Bridge doesn't carry the same biases as some humans have, because it doesn't know the name, nationality or university degree of the candidates. The score that is shown for the matches is based mostly on the hard skills of the candidate and the rate that it matches with what is described in the job application. Secondly, the soft skills are taken into account, however they carry a little less weight than the hard skills. Lastly, the values are another factor of the matching percentage and they carry the lowest weight. So what does this mean for the score? Imagine the job asks for 5 hard skills, 6 soft skills and 4 values. The hard skills count for 1 and the soft skills and values count for 1/2, which means the total score of this job is 10. A candidate having all 5 hard skills already matches 50%, and gains more percentage points with some of the soft skills and values. A candidate having 5 soft skills or values doesn't get a matching rate of 50% because these criteria have a little less weight than the hard skills required for the job.",
    },
    {
      question: "What happens when a candidate contacts me?",
      answer:
        "Candidates can browse for jobs and when they see one that you like, they can let you know they want to apply by sending over their personal information. Normally, as a recruiter, you can only see your public profile, with skills, values and languages, but in this case candidates can decide what else they want to share besides their contact details. You’ll get a notification and be able to open their profile with the enhanced information.",
    },
    {
      question: "What happens when I want to contact a candidate?",
      answer:
        "As a recruiter, you can browse through candidate profiles and find your favorites. When you’ve found a good candidate for your job, you have to request access to their personal information. The candidate sees a request coming in and gets to decide if they want to share their contact details and other parts of their more personal information with you.From here, it works the same as if they contacted you. You’ll see a notification, where you can go to the profile of the candidate that now holds more information than the public profile info.",
    },
    {
      question: "Can I save my preferred candidates?",
      answer:
        "Yes! You will find a save button on all candidates, also in the overview page. These candidates can be found back on the shortlist page. Coming soon: saving candidates per job!",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, please go to your settings page on the sidebar. Once you request a removal of your account, Bridge will delete all your data. The action cannot be undone so in case you want to get back on the platform, an association will have to send you a new invite. ",
    },
    {
      question: "Can I change my password?",
      answer: "Yes, please go to your settings page on the sidebar.",
    },
  ];

  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const togglePanel = (index: number) => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter((item) => item !== index));
    } else {
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userType = auth?.user?.user_type;

  const faqContent =
    userType === "candidate" ? faqDataCandidates : faqDataCompanies;

  return (
    <div className={styling.main}>
      <h1>Frequently Asked Questions</h1>
      {faqContent?.map((item: any, index: number) => (
        <div key={index} className={styling.panel}>
          <div className={styling.question} onClick={() => togglePanel(index)}>
            {item.question}
            <span>
              {activeIndexes.includes(index) ? (
                <IconChevronUp />
              ) : (
                <IconChevronDown />
              )}
            </span>
          </div>
          {activeIndexes.includes(index) && (
            <div className={styling.answer}>{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
