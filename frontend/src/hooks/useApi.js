import { useEffect, useState } from 'react';
import apiClient from '../services/api';

export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await apiClient.states.getAll();
        setStates(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
};

export const useStateBySlug = (slug) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchState = async () => {
      try {
        setLoading(true);
        const response = await apiClient.states.getBySlug(slug);
        setState(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [slug]);

  return { state, loading, error };
};

export const useDestinations = (filters = {}) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.destinations.getAll(filters);
        setDestinations(response.data);
        setPagination({
          total: response.total,
          pages: response.pages,
          currentPage: response.currentPage
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [filters]);

  return { destinations, loading, error, pagination };
};

export const useDestinationBySlug = (slug) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await apiClient.destinations.getBySlug(slug);
        setDestination(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  return { destination, loading, error };
};

export const useDestinationsByState = (stateId) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stateId) return;

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.destinations.getByState(stateId);
        setDestinations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [stateId]);

  return { destinations, loading, error };
};
