import { useState, useEffect } from 'react';
import { Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import { notification } from 'antd';

function JobPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    city: '',
    country: '',
    sector: '',
    description: ''
  });
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load job details from local storage on component mount
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs'));
    if (storedJobs) {
      setJobs(storedJobs);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Add new job to the list
    if (
      !formData.jobTitle ||
      !formData.city ||
      !formData.country ||
      !formData.sector ||
      !formData.description
    ) {
      notification.error({
        message: 'Incomplete Data',
        description: 'Please fill all fields with valid data.',
        placement: 'topRight' 
      });
      return; // Stop further execution
    }
    const newJobs = [...jobs, formData];
    setJobs(newJobs);
    // Store the updated job list in local storage
    localStorage.setItem('jobs', JSON.stringify(newJobs));
    setFormData({
      jobTitle: '',
      city: '',
      country: '',
      sector: '',
      description: ''
    });
    setIsModalOpen(false);
    notification.success({
      message: 'Job Added',
      description: 'The job has been successfully added.',
      placement: 'topRight' 
    })
  };

  const handleDelete = (index) => {
    // Remove job at the given index
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
    // Update local storage 
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };


  

  // Filter jobs based on search query ++++++++++++++++++++++++++++++++
  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="Job-Panel">
        <h2>JOB LIST</h2>
        <div className="Job-Panel-upper-settings">
          {/* Search bar ++++++++++++++++++++++++++++++++ */}
          <TextField fullWidth label="Search By Job Title" id="SearchBar" name="SearchBar" value={searchQuery} onChange={handleSearch} />
          {/* Button with popup functionality ++++++++++++++++++++++++++++++++*/}
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>Add New Job</Button>
          {/* POP UP for dialog box ++++++++++++++++++++++++++++++++*/}
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, width: 400 }}>
              <h2>Add Job</h2>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField name="jobTitle" label="Job Title" variant="outlined" fullWidth value={formData.jobTitle} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="sector-label">Sector</InputLabel>
                      <Select labelId="sector-label" label="Sector" name="sector" value={formData.sector} onChange={handleInputChange}>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        {/* Add more ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="country" label="Country" variant="outlined" fullWidth value={formData.country} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="city" label="City" variant="outlined" fullWidth value={formData.city} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="description" label="Description" variant="outlined" fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Submit</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  </Grid>
                </Grid>
                <br />
              </form>
            </div>
          </Modal>
        </div>
        <div className="Job-Panel-card-container">
          {filteredJobs.map((job, index) => (
            <div className="Job-Panel-card" key={index}>
               <div className='Job-Panel-card-actions'>
                
                {/* <Button variant="contained" color="secondary" onClick={() => handleDelete(index)}>Delete</Button> */}
                <EyeOutlined className='view' onClick={() => handleViewJob(job)} />
                <Modal open={isModalViewOpen} onClose={() => isModalViewOpen(false)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, width: 400 }}>
            
            {selectedJob && ( // Render if a job is selected
              <div>
                <h2>{selectedJob.jobTitle}</h2>
              <div className='Job-Panel-card-Image'>
                <img src="stockimage.jpg" alt="image" />
              </div>
                <h4>Location : {selectedJob.city}, {selectedJob.country}.</h4>
                <h4>Sector : {selectedJob.sector}</h4>
                <h4>Job description : {selectedJob.description}</h4>
              </div>
            )}
            <Button variant="contained" color="primary" onClick={() =>  setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
                <DeleteOutlined className='delete' onClick={() => handleDelete(index)} />
                {/* Add view icon here */}
              </div>
              <div className='Job-Panel-card-Image'>
                <img src="stockimage.jpg" alt="image" />
              </div>
              <div className='Job-Panel-card-description'>
                <h3>{job.jobTitle}</h3>
                <h4>{job.city}, {job.country}.</h4>
                <h4>{job.sector}</h4>
                <h4>{job.description}</h4>
                {/* <Button variant="contained" color="secondary" onClick={() => handleDelete(index)}>Delete</Button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default JobPanel;
