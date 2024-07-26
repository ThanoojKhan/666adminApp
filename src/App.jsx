import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, limit, startAfter, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limitPerPage] = useState(15);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEnquiries = async (page) => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleMarkAsAttended = async (id) => {
    setLoading(true);
    try {
      const enquiryRef = doc(db, 'enquiries', id);
      await updateDoc(enquiryRef, { attended: true });
      alert('Marked as attended successfully');
      fetchEnquiries(currentPage);
    } catch (error) {
      alert('Error marking as attended: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      setLoading(true);
      try {
        const enquiryRef = doc(db, 'enquiries', id);
        await deleteDoc(enquiryRef);
        alert('Deleted successfully');
        fetchEnquiries(currentPage);
      } catch (error) {
        alert('Error deleting enquiry: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
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
    <div className="overflow-x-auto w-full p-4">
      {loading && (
        <div className="flex justify-center items-center h-16">
          <div className="loader"></div>
        </div>
      )}
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Car Brand</th>
            <th className="border px-4 py-2">Car Name</th>
            <th className="border px-4 py-2">Service Required</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map(enquiry => (
            <tr key={enquiry.id} className="hover:bg-gray-600 border-b border-gray-200">
              <td className="border px-4 py-2">{enquiry.name}</td>
              <td className="border px-4 py-2">{enquiry.carBrand}</td>
              <td className="border px-4 py-2">{enquiry.carName}</td>
              <td className="border px-4 py-2">{enquiry.servicesRequired.join(', ')}</td>
              <td className="border px-4 py-2">{enquiry.phoneNumber}</td>
              <td className="border px-4 py-2">{enquiry.location}</td>
              <td className="border px-4 py-2">{enquiry.createdAt}</td>
              <td className="border px-4 py-2">
                {enquiry.attended ? (
                  <>
                    <span className="bg-green-100 text-green-700 py-1 px-2 rounded-md">Attended</span>
                    <button
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md ml-2"
                      onClick={() => handleDelete(enquiry.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    onClick={() => handleMarkAsAttended(enquiry.id)}
                  >
                    Mark as Attended
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <p className="text-gray-700">Page {currentPage} of {totalPages}</p>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
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
