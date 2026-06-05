"use client"

type CommitteeMember = {
  name: string
  affiliation: string
}

type CommitteeGroup = {
  role: string
  members: CommitteeMember[]
}

export default function GlobalConnectCommittee() {
  const committeeGroups: CommitteeGroup[] = [
    {
      role: "Website Designing",
      members: [
        { name: "Pranav Manurkar", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Mohit Garhewal", affiliation: "MEMS, IIT Indore" },
        { name: "Rishav Sharma", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Session Management",
      members: [
        { name: "Suman Yadav", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Prabhat Kumar Singh", affiliation: "APSUD, RRCAT, Indore" },
        { name: "Bharti Ojha", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Bharthi Paltiya", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Shubham Parihar", affiliation: "MEMS, IIT Indore" },
        { name: "Priti Roy", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Apurva Karahe", affiliation: "MEMS, IIT Indore" },
        { name: "Ankit Yadav", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Registration and Help Desk",
      members: [
        { name: "Aayushi Miglani", affiliation: "Phys, IIT Indore (C)" },
        { name: "Shamma Parveen", affiliation: "MEMS, IIT Indore" },
        { name: "Manopriya Samtham", affiliation: "MEMS, IIT Indore" },
        { name: "Sheetal Yamalakonda", affiliation: "MEMS, IIT Indore" },
        { name: "Samraj", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Apoorv Purohit", affiliation: "MEMS, IIT Indore" },
        { name: "Soumi Mukherji", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Awards",
      members: [
        { name: "Shyam Lal Gurjar", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Saurav Kumar Dubey", affiliation: "Phys, IIT Indore" },
        { name: "Soumi Mukherji", affiliation: "MEMS, IIT Indore" },
        { name: "Rishiraj Awasthi", affiliation: "MEMS, IIT Indore" },
        { name: "Akhilesh Choudhary", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Publicity and Press",
      members: [
        { name: "Rishav Sharma", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Ankit Yadav", affiliation: "MEMS, IIT Indore" },
        { name: "Ajay Patil", affiliation: "MEMS, IIT Indore" },
        { name: "Gaurav Chouhan", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Apurva Karahe", affiliation: "MEMS, IIT Indore" },
        { name: "Suman Yadav", affiliation: "MEMS, IIT Indore" },
        { name: "Ekta Choudhary", affiliation: "Phys, IIT Indore" },
        { name: "Shamma Parveen", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Transportation",
      members: [
        { name: "Ajay Patil", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Mohit Tiwari", affiliation: "MEMS, IIT Indore" },
        { name: "Bhimrao Mohan Hiwarale", affiliation: "Chem, IITI" },
        { name: "Yogesh Kuamr Yadav", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Rajan Mishra", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Shivam Choudhary", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Gaurav Chouhan", affiliation: "UGC-DAE CSR, Indore" },
      ],
    },
    {
      role: "Accommodation",
      members: [
        { name: "Ekta Choudhary", affiliation: "Phys, IIT Indore (C)" },
        { name: "Aayushi Miglani", affiliation: "Phys, IIT Indore" },
        { name: "Apoorv Purohit", affiliation: "MEMS, IIT Indore" },
        { name: "Gaurav Tiwari", affiliation: "MEMS, IIT Indore" },
        { name: "Saurav Kumar Dubey", affiliation: "Phys, IIT Indore" },
        { name: "Jerin K. Roy", affiliation: "Phys, IIT Indore" },
        { name: "Dharmendra Kumar", affiliation: "MEMS, IIT Indore" },
      ],
    },
    {
      role: "Catering",
      members: [
        { name: "Manopriya Samtham", affiliation: "MEMS, IIT Indore (C)" },
        { name: "Aayushi Miglani", affiliation: "Phys, IIT Indore" },
        { name: "Suman Yadav", affiliation: "MEMS, IIT Indore" },
        { name: "Saurav Kumar Dubey", affiliation: "Phys, IIT Indore" },
        { name: "Rishav Sharma", affiliation: "MEMS, IIT Indore" },
        { name: "Akhilesh Choudhary", affiliation: "MEMS, IIT Indore" },
        { name: "Rajan Mishra", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Yogesh Kuamr Yadav", affiliation: "UGC-DAE CSR, Indore" },
        { name: "Subho Saha", affiliation: "UGC-DAE CSR, Indore" },
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
        {committeeGroups.map((group) => (
          <section
            key={group.role}
            className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] shadow-md overflow-hidden"
          >
            <div className="bg-[color:var(--nav)] px-5 py-4">
              <h3 className="text-white text-lg font-bold">{group.role}</h3>
            </div>

            <div className="p-5 space-y-1.5">
              <div className="space-y-1.5">
                {group.members.map((member) => (
                  <div
                    key={`${group.role}-${member.name}`}
                    className="border-b border-[color:var(--nav)]/10 pb-1.5 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm text-[color:var(--nav)] leading-snug">
                      <span className="font-semibold">{member.name}</span>{" "}
                      <span className="text-[color:var(--nav)]/70">
                        {renderAffiliation(member.affiliation)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
