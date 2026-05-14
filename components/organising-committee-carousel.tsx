"use client"


type CommitteeMember = {
  name: string
  affiliation: string
}

type CommitteeGroup = {
  role: string
  members: CommitteeMember[]
}

export default function OrganisingCommitteeCarousel() {
  const committeeGroups: CommitteeGroup[] = [
    {
      role: "Patron",
      members: [{ name: "Prof. Suhas S. Joshi", affiliation: "Director, IIT Indore" }],
    },
    {
      role: "Convenor",
      members: [{ name: "Prof. Rupesh S. Devan", affiliation: "MEMS/CEVITS IIT Indore" }],
    },
    {
      role: "Co-Convenor(s)",
      members: [
        { name: "Dr. Ram Janay Choudhary", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Ravindra Jangir", affiliation: "RRCAT, Indore" },
      ],
    },
    {
      role: "Publication Co-convenor",
      members: [{ name: "Dr. Rohini Kitture", affiliation: "Wiley" }],
    },
    {
      role: "Treasurers",
      members: [
        { name: "Dr. Sunil Kumar", affiliation: "MEMS/CEVITS IIT Indore" },
        { name: "Prof. Santosh Hosmani", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Website and Publicity",
      members: [
        { name: "Dr. Praveen Velpulla", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Venkata Vamsi Koruprolu", affiliation: "MEMS IIT Indore (C)" },
        { name: "Mr. Avinash Ojha", affiliation: "RRCAT Indore" },
      ],
    },
    {
      role: "Session Management",
      members: [
        { name: "Dr. Abhinav Raghuvanshi", affiliation: "Chem IIT Indore" },
        { name: "Dr. C. Kamal", affiliation: "RRCAT Indore" },
        { name: "Dr. Hinamshu Srivastava", affiliation: "RRCAT Indore (C)" },
        { name: "Prof. Santosh Hosmani", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Sunil Kumar", affiliation: "MEMS IIT INDORE (C)" },
        { name: "Dr. Umesh A. Kshirsagar", affiliation: "Chem IIT Indore" },
        { name: "Dr. Venkata Vamsi Koruprolu", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Debalya Sarker", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Dinesh Shukla", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Rajeev Batabyal", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Sanjoy Mahatha", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Mr. Pranjal Shrimali", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Session Co-chairs",
      members: [
        { name: "Prof. Biswarup Pathak", affiliation: "Chem IIT Indore" },
        { name: "Prof. I. A. Palani", affiliation: "ME/CEVITS IIT Indore" },
        { name: "Prof. Krushna Mavani", affiliation: "Phys. IIT Indore" },
        { name: "Prof. Pankaj R. Sagdeo", affiliation: "Phys IIT Indore" },
        { name: "Prof. Parasharam M. Shirage", affiliation: "MEMS IIT Indore" },
        { name: "Prof. Prashant Kodgire", affiliation: "BSBE IIT Indore" },
        { name: "Prof. Preeti Bhobe", affiliation: "Phys IIT Indore" },
        { name: "Prof. Rajesh Kumar", affiliation: "Phys IIT Indore" },
        { name: "Dr. Archana Lakhani", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Mukul Gupta", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. V.R. Reddy", affiliation: "UGC-DAE CSR, Indore" },
      ],
    },
    {
      role: "Registration and Help Desk",
      members: [
        { name: "Dr. Lokesh Basavrajappa", affiliation: "BSBE IIT Indore" },
        { name: "Dr. Mrigendra Dubey", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Pravarthana Dhanapal", affiliation: "Chem IIT Indore" },
        { name: "Dr. Srashtasrita Das", affiliation: "ChE IIT Indore" },
        { name: "Dr. Gunjan Verma", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Praveen Velpulla", affiliation: "UGC-DAE CSR, Indore (C)" },
        { name: "Dr. Sudip Pal", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Mr. Mahesh Chand Bairwa", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Pavitra Sahu", affiliation: "RRCAT Indore" },
      ],
    },
    {
      role: "Award Committee",
      members: [
        { name: "Dr. Rohini Kitture", affiliation: "Wiley" },
        { name: "Dr. Salahuddin Kahn", affiliation: "RRCAT Indore (C)" },
        { name: "Dr. Sunil Kumar", affiliation: "MEMS/CEVITS IIT Indore (C)" },
        { name: "Prof. Pavan Kankar", affiliation: "ME IIT Indore" },
        { name: "Prof. Trapti Jain", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Rajamani Raghunathan", affiliation: "UGC-DAE CSR, Indore (C)" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Pranjal Shrimali", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Publication & Press",
      members: [
        { name: "Dr. B. Prathap Reddy", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Mohammad Sohrab", affiliation: "RRCAT Indore" },
        { name: "Dr. Nisheeth Kumar Prasad", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Onkar Game", affiliation: "Phys IIT Indore (C)" },
        { name: "Prof. Parasharam M. Shirage", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Ranjith Kumar", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Salahuddin Khan", affiliation: "RRCAT Indore (C)" },
        { name: "Dr. Sandeep Singh", affiliation: "ME IIT Indore" },
        { name: "Dr. Subhadeep Paladhi", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Sumanta Samal", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Vinod Kumar", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Arvind Yogi", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Devendra Kumar", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Dr. Rajamani Raghunathan", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Transport and Tour",
      members: [
        { name: "Dr. Mayur Jain", affiliation: "CE IIT Indore" },
        { name: "Dr. Nisheeth Kumar Prasad", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Onkar Game", affiliation: "Phys IIT Indore" },
        { name: "Dr. Ranjith Kumar", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Dilip Kumar", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Accommodation",
      members: [
        { name: "Dr. Abhijeet Joshi", affiliation: "BSBE IIT Indore" },
        { name: "Dr. Dhirendra Kumar Rai", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Jayaprakash Muragesan", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Saptarshi Ghosh", affiliation: "EE IIT Indore" },
        { name: "Dr. Dilip Kumar", affiliation: "UGC-DAE CSR, Indore (C)" },
        { name: "Dr. R. Venkatesh", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Mr. Shubham Verma", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Suresh Chandra Patidar", affiliation: "RRCAT Indore" },
      ],
    },
    {
      role: "Catering",
      members: [
        { name: "Prof. Amod Umarikar", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Mayur Jain", affiliation: "CE IIT Indore" },
        { name: "Dr. Pravarthana Dhanapal", affiliation: "Chem IIT Indore (C)" },
        { name: "Dr. Sandeep Singh", affiliation: "ME IIT Indore" },
        { name: "Dr. Umesh A. Kshirsagar", affiliation: "Chem IIT Indore" },
        { name: "Mr. Mahesh Chand Bairwa", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Shubham Verma", affiliation: "MEMS IIT Indore" },
      ],
    },
  ]

  const renderAffiliation = (aff: string) => {
    const parts = aff.split(/(\(C\))/i)
    return (
      <>
        {parts.map((part, i) =>
          /\(C\)/i.test(part) ? (
            <strong key={i} className="font-semibold">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    )
  }

  return (
    <div className="py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {committeeGroups.map((group, groupIndex) => (
          <section
            key={group.role}
            className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] shadow-md overflow-hidden"
          >
            <div className="bg-[color:var(--nav)] px-5 py-4">
              <h3 className="text-white text-lg font-bold">{group.role}</h3>
            </div>

            <div className="p-5 space-y-1.5">
              {groupIndex < 4 ? (
                group.members.map((member) => (
                  <div key={`${group.role}-${member.name}`} className="rounded-xl border border-[color:var(--nav)]/10 bg-white px-3 py-2">
                    <p className="text-sm text-[color:var(--nav)] leading-snug">
                      <span className="font-semibold">{member.name}</span>{" "}
                      <span className="text-[color:var(--nav)]/70">{renderAffiliation(member.affiliation)}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="space-y-1.5">
                  {group.members.map((member) => (
                    <div key={`${group.role}-${member.name}`} className="border-b border-[color:var(--nav)]/10 pb-1.5 last:border-b-0 last:pb-0">
                      <p className="text-sm text-[color:var(--nav)] leading-snug">
                        <span className="font-semibold">{member.name}</span>{" "}
                        <span className="text-[color:var(--nav)]/70">{renderAffiliation(member.affiliation)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
