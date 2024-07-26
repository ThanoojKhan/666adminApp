import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limitPerPage] = useState(15);
  const [lastVisible, setLastVisible] = useState(null);

  const fetchEnquiries = async (page) => {
    const enquiriesRef = collection(db, 'enquiries');
    let q;

    if (page === 1) {
      q = query(enquiriesRef, orderBy('createdAt', 'desc'), limit(limitPerPage));
    } else {
      q = query(enquiriesRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(limitPerPage));
    }

    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }

    const fetchedEnquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toDateString()
    }));

    setEnquiries(page === 1 ? fetchedEnquiries : enquiries.concat(fetchedEnquiries));

    const totalDocsSnapshot = await getDocs(enquiriesRef);
    setTotalPages(Math.ceil(totalDocsSnapshot.size / limitPerPage));
  };

  useEffect(() => {
    fetchEnquiries(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Car Brand</th>
            <th className="border px-4 py-2">Car Name</th>
            <th className="border px-4 py-2">Service Required</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map(enquiry => (
            <tr key={enquiry.id} className="border border-gray-400 hover:bg-gray-100">
              <td className="border px-4 py-2">{enquiry.name}</td>
              <td className="border px-4 py-2">{enquiry.carBrand}</td>
              <td className="border px-4 py-2">{enquiry.carName}</td>
              <td className="border px-4 py-2">{enquiry.servicesRequired.join(', ')}</td>
              <td className="border px-4 py-2">{enquiry.phoneNumber}</td>
              <td className="border px-4 py-2">{enquiry.location}</td>
              <td className="border px-4 py-2">{enquiry.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <p>Page {currentPage} of {totalPages}</p>
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
