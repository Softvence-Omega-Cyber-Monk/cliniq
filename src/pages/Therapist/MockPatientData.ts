import { SessionHistory } from "./TherapistType";

 export const mockPatientData = {
    age: 30,
    email: "alexjohnson@patient.com",
    phone: "+1 (555) 123-4567",
    healthIssue: "Anxiety and Stress",
    emergencyContactName: "Emily Smith",
    emergencyContactPhone: "+1 (555) 987-6543",
    overallProgress: 70,
    treatmentGoals: [
      { title: "Reduce anxiety attacks", progress: 75 },
      { title: "Improve sleep quality", progress: 80 },
      { title: "Develop healthy coping mechanisms", progress: 90 },
      { title: "Manage work-related stress", progress: 60 },
    ],
    sessionHistory: [
      {
        date: "March 15, 2024",
        summary:
          "Discussed coping mechanisms for stress. Patient showed good engagement.",
        duration: 50,
        fullNote:
          "The patient reported feeling significantly better about their recent work-related stress, attributing the improvement to the newly implemented time management and boundary-setting strategies discussed last session. We dedicated the session to reviewing cognitive reframing techniques to address persistent negative self-talk patterns. Patient successfully identified three common distorted thought patterns. Homework: practice challenging these thoughts using the provided worksheet. Goal progress: Maintain reduced anxiety levels.",
      },
      {
        date: "March 8, 2024",
        summary:
          "Reviewed anxiety triggers and practiced breathing techniques.",
        duration: 50,
        fullNote:
          "We explored various anxiety triggers and engaged in effective breathing exercises. Understanding what causes anxiety can empower us to manage it better. We practiced deep breathing techniques to help calm our minds. These methods can be beneficial in stressful situations. Remember, taking a moment to breathe can make a significant difference. The patient showed good engagement and reported a noticeable drop in perceived anxiety (from 7/10 to 3/10) during the session. Homework: use the 4-7-8 breathing technique three times daily.",
      },
      {
        date: "March 1, 2024",
        summary:
          "Initial assessment and goal setting. Established treatment plan.",
        duration: 50,
        fullNote:
          "Initial assessment completed. The patient presents with Generalized Anxiety Disorder (GAD) and mild symptoms of social anxiety. Primary goals were established: 1) Reduce frequency of panic attacks, 2) Improve sleep quality, and 3) Develop healthy coping mechanisms. Treatment plan is primarily CBT-focused with elements of mindfulness. Patient consented to the plan. Homework: Start journaling daily mood and sleep patterns.",
      },
      {
        date: "February 22, 2024",
        summary:
          "Patient reported reduced anxiety levels. Continued CBT exercises.",
        duration: 50,
        fullNote:
          "Patient reported reduced anxiety levels. Continued CBT exercises. We focused on identifying automatic negative thoughts (ANTs) and replacing them with balanced perspectives. The patient brought up some challenges related to a recent family interaction, which we processed using the Socratic method. Progress is steady. Homework: continue journaling and bring in one completed thought record.",
      },
      {
        date: "February 15, 2024",
        summary:
          "Discussed work-related stress and time management strategies.",
        duration: 50,
        fullNote:
          "Focused session on occupational stress. Identified procrastination and poor boundary setting as key contributors. Introduced basic time management strategies (Pomodoro technique) and assertiveness training. The patient seemed receptive. Homework: implement the Pomodoro technique for work tasks and write down two instances where they successfully set a boundary.",
      },
    ] as SessionHistory[],
  };