import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaCheck, FaBan, FaSearch, FaFilter } from "react-icons/fa";
import EvidenceModal from "../../components/EvidenceModal"; // Import the modal we just made



const DUMMY_CAMPAIGNS = [
  {
    _id: "65a1b2c3d4e5f6g7h8i9j0k1",
    title: "Urgent Surgery for Little Emeka",
    description: "My 5-year-old son Emeka has been diagnosed with a hole in the heart. We need this money urgently for his surgery at UCH Ibadan. Please help us save his life.",
    goalAmount: 5000, // $5,000
    status: "pending",
    createdAt: "2026-01-10T09:00:00Z",
    image: "https://res.cloudinary.com/demo/image/upload/v1675000000/sick_child_demo.jpg",
    user: {
      fullName: "Chioma Okeke",
      email: "chioma.okeke@example.com"
    },
    evidence: [
      {
        name: "UCH Medical Report.pdf",
        type: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      {
        name: "Doctor's Recommendation Letter.jpg",
        type: "image/jpeg",
        url: "https://res.cloudinary.com/demo/image/upload/v1675000001/doc_letter.jpg"
      }
    ]
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j0k2",
    title: "Final Year Project Funding: Solar Powered Yam Pounder",
    description: "I am a final year student at OAU. I am building a solar-powered yam pounder for rural women. I need funds to import the DC motor and solar panels.",
    goalAmount: 1200, // $1,200
    status: "pending",
    createdAt: "2026-01-12T14:30:00Z",
    image: "https://res.cloudinary.com/demo/image/upload/v1675000002/tech_project_demo.jpg",
    user: {
      fullName: "Tunde Bakare",
      email: "tunde.b@example.com"
    },
    evidence: [
      {
        name: "School ID Card.jpg",
        type: "image/jpeg",
        url: "https://res.cloudinary.com/demo/image/upload/v1675000003/id_card.jpg"
      },
      {
        name: "Project Proposal.pdf",
        type: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    ]
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j0k3",
    title: "Rebuilding My Shop After Market Fire",
    description: "I lost everything in the recent fire outbreak at Tejuosho Market. I need capital to restock my textile business. I have proof of ownership and police report.",
    goalAmount: 8500, // $8,500
    status: "pending",
    createdAt: "2026-01-13T08:15:00Z",
    image: "https://res.cloudinary.com/demo/image/upload/v1675000004/market_fire_demo.jpg",
    user: {
      fullName: "Iya Loja",
      email: "iyaloja@example.com"
    },
    evidence: [
      {
        name: "Police Report.jpg",
        type: "image/jpeg",
        url: "https://res.cloudinary.com/demo/image/upload/v1675000005/police_report.jpg"
      },
      {
        name: "Shop Allocation Paper.jpg",
        type: "image/jpeg",
        url: "https://res.cloudinary.com/demo/image/upload/v1675000006/allocation.jpg"
      },
      {
        name: "Fire Service Report.pdf",
        type: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    ]
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j0k4",
    title: "Suspicious Campaign Without Evidence",
    description: "I just need money to enjoy my life. Please donate to me. I promise to use it well.",
    goalAmount: 100000, // $100,000
    status: "pending",
    createdAt: "2026-01-13T10:00:00Z",
    image: "https://res.cloudinary.com/demo/image/upload/v1675000007/party_demo.jpg",
    user: {
      fullName: "Unknown User",
      email: "scammer@example.com"
    },
    evidence: [] // Empty to test the "No Evidence" UI
  }
];



export default function ManagePage() {
  // const [campaigns, setCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState(DUMMY_CAMPAIGNS);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the Modal
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch logic
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
             // You might need an admin-specific route later, but this works for now
             headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter for "Pending" locally for now
        const pending = res.data.data.filter(c => c.status === 'pending');
        setCampaigns(pending);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Handlers
  const handleViewEvidence = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleApprove = async (id) => {
      if(!confirm("Are you sure you want to approve this campaign?")) return;
      // Call your backend approve API here
      console.log("Approving:", id);
  };

  const handleReject = async (id) => {
      if(!confirm("Are you sure you want to reject this campaign?")) return;
      // Call your backend reject API here
      console.log("Rejecting:", id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin <span className="text-orange-600">Dashboard</span>
            </h1>
            <div className="flex items-center gap-3">
               <span className="text-sm text-slate-500">Logged in as Admin</span>
               <div className="h-8 w-8 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* --- STATS & FILTERS --- */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
                <h2 className="text-lg font-medium text-slate-900">Pending Reviews</h2>
                <p className="mt-1 text-sm text-slate-500">
                    You have <strong className="text-orange-600">{campaigns.length}</strong> campaigns waiting for verification.
                </p>
            </div>
            {/* Search Bar */}
            <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    placeholder="Search campaigns..."
                />
            </div>
        </div>

        {/* --- THE TABLE --- */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
             <div className="p-10 text-center text-slate-500">Loading pending campaigns...</div>
          ) : campaigns.length === 0 ? (
             <div className="p-10 text-center text-slate-500">No pending campaigns found. Great job!</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Campaign Info</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Evidence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Goal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date Submitted</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                {campaigns.map((campaign) => (
                    <tr key={campaign._id} className="hover:bg-slate-50 transition-colors">
                    {/* Column 1: Info */}
                    <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-lg object-cover" src={campaign.image || "https://via.placeholder.com/150"} alt="" />
                            </div>
                            <div className="ml-4">
                                <div className="font-medium text-slate-900 truncate max-w-[200px]" title={campaign.title}>{campaign.title}</div>
                                <div className="text-xs text-slate-500">by {campaign.user?.fullName || "User"}</div>
                            </div>
                        </div>
                    </td>

                    {/* Column 2: Evidence Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.evidence?.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            {campaign.evidence?.length || 0} Documents
                        </span>
                    </td>

                    {/* Column 3: Goal */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        ${campaign.goalAmount?.toLocaleString()}
                    </td>

                    {/* Column 4: Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>

                    {/* Column 5: Actions */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            {/* View Evidence Button */}
                            <button 
                                onClick={() => handleViewEvidence(campaign)}
                                className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                            >
                                <FaEye className="text-slate-400" /> Evidence
                            </button>

                            {/* Approve (Tick) */}
                            <button 
                                onClick={() => handleApprove(campaign._id)}
                                className="rounded-md bg-green-50 p-1.5 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                                title="Approve Campaign"
                            >
                                <FaCheck />
                            </button>

                            {/* Reject (Ban) */}
                            <button 
                                onClick={() => handleReject(campaign._id)}
                                className="rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                title="Reject Campaign"
                            >
                                <FaBan />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          )}
        </div>
      </main>

      {/* --- EVIDENCE MODAL --- */}
      <EvidenceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        campaign={selectedCampaign}
      />

    </div>
  );
}