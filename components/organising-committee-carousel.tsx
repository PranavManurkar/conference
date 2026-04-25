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
      members: [{ name: "Dr. Venkata Vamsi Koruprolu", affiliation: "MEMS IIT Indore (C)" }],
    },
    {
      role: "Session Management",
      members: [
        { name: "Dr. Abhinav Raghuvanshi", affiliation: "Chem IIT Indore" },
        { name: "Prof. Santosh Hosmani", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Sunil Kumar", affiliation: "MEMS IIT INDORE (C)" },
        { name: "Dr. Umesh A. Kshirsagar", affiliation: "Chem IIT Indore" },
        { name: "Dr. Venkata Vamsi Koruprolu", affiliation: "MEMS IIT Indore" },
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
      ],
    },
    {
      role: "Registration and Help Desk",
      members: [
        { name: "Dr. Lokesh Basavrajappa", affiliation: "BSBE IIT Indore" },
        { name: "Dr. Mrigendra Dubey", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Pravarthana Dhanapal", affiliation: "Chem IIT Indore" },
        { name: "Dr. Srashtasrita Das", affiliation: "ChE IIT Indore" },
        { name: "Mr. Mahesh Chand Bairwa", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Award Committee",
      members: [
        { name: "Dr. Rohini Kitture", affiliation: "Wiley" },
        { name: "Dr. Sunil Kumar", affiliation: "MEMS/CEVITS IIT Indore (C)" },
        { name: "Prof. Pavan Kankar", affiliation: "ME IIT Indore" },
        { name: "Prof. Trapti Jain", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Mr. Mayur Dhake", affiliation: "MEMS IIT Indore" },
        { name: "Mr. Pranjal Shrimali", affiliation: "MEMS IIT Indore" },
      ],
    },
    {
      role: "Publication & Press",
      members: [
        { name: "Dr. B. Prathap Reddy", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Nisheeth Kumar Prasad", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Onkar Game", affiliation: "Phys IIT Indore (C)" },
        { name: "Prof. Parasharam M. Shirage", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Ranjith Kumar", affiliation: "MEMS IIT Indore (C)" },
        { name: "Dr. Sandeep Singh", affiliation: "ME IIT Indore" },
        { name: "Dr. Subhadeep Paladhi", affiliation: "EE/CEVITS IIT Indore" },
        { name: "Dr. Sumanta Samal", affiliation: "MEMS IIT Indore" },
        { name: "Dr. Vinod Kumar", affiliation: "MEMS IIT Indore" },
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
        { name: "Mr. Shubham Verma", affiliation: "MEMS IIT Indore" },
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

  return (
    <div className="py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {committeeGroups.map((group) => (
          <section
            key={group.role}
            className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] shadow-md overflow-hidden"
          >
            <div className="bg-[color:var(--nav)] px-5 py-4">
              <h3 className="text-white text-lg font-bold">{group.role}</h3>
            </div>

            <div className="p-5 space-y-3">
              {group.members.map((member) => (
                <div key={`${group.role}-${member.name}`} className="rounded-xl border border-[color:var(--nav)]/10 bg-white p-4">
                  <p className="font-semibold text-[color:var(--nav)]">{member.name}</p>
                  <p className="text-sm text-[color:var(--nav)]/70 mt-1">{member.affiliation}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
