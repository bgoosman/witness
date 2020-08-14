import React, { useState, useEffect, SyntheticEvent } from "react";
import { TextField, Button, Container, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { TimelineEventData } from "../models/timeline-event";
import { EventStore } from "../stores/event-store";
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
   root: {
      padding: '1rem',
      '& p': {
         padding: '1rem'
      }
   },
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   }
}));

const defaultEvent: TimelineEventData = {
   id: '',
   doucetteId: '',
   groupId: '',
   city: '',
   state: '',
   date: '',
   timeOfDay: '',
   description: '',
   sourceLink: '',
   youtube: '',
   tagged: false
};

interface TagEventPageProps {
   eventStore: EventStore;
}

interface FormEvent {
   target: FormTarget;
}

interface FormTarget {
   name: string;
   value: string;
}

export const TagEventPage = (props: TagEventPageProps) => {
   const { eventStore } = props;
   const classes = useStyles();
   const [loading, setLoading] = useState(true);
   const [values, setValues] = useState<TimelineEventData>(defaultEvent);

   useEffect(() => {
      fetchUntaggedEvent();
   }, []);

   const handleInputChange = (e: FormEvent) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
   }

   const handleSkip = (event: SyntheticEvent) => {
      fetchUntaggedEvent();
   }

   const fetchUntaggedEvent = () => {
      setLoading(true);
      eventStore.getUntaggedEvent().then((event: TimelineEventData) => {
         if (event) {
            setValues(event);
         } else {
            setValues(defaultEvent);
         }
      }).finally(() => {
         setLoading(false);
      });
   }

   const handleSubmit = (event: SyntheticEvent) => {
      setLoading(true);
      eventStore.putEvent(values).then(() => {
         fetchUntaggedEvent();
      }).finally(() => {
         setLoading(false);
      });
      event.preventDefault();
   }

   return (
      <Container component="main" maxWidth="xs">
         {values.id != '' &&
            <div className={classes.paper}>
               <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  <Button
                     variant="outlined"
                     color="primary"
                     startIcon={<RefreshIcon />}
                     onClick={handleSkip}
                  >
                     Skip
                  </Button>
                  <TextField
                     name='sourceLink'
                     label='Twitter Link'
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     disabled={loading}
                     onChange={handleInputChange}
                     value={values.sourceLink}
                  />
                  <TextField
                     name='id'
                     label='Id'
                     disabled
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.id}
                  />
                  <TextField
                     name='doucetteId'
                     label='Doucette Id'
                     disabled
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.doucetteId}
                  />
                  <TextField
                     name='groupId'
                     label='Group Id'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.groupId}
                  />
                  <TextField
                     name='city'
                     label='City'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.city}
                  />
                  <TextField
                     name='state'
                     label='State'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.state}
                  />
                  <TextField
                     name='date'
                     label='Date'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.date}
                  />
                  <TextField
                     name='timeOfDay'
                     label='Time of Day'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.timeOfDay}
                  />
                  <TextField
                     name='description'
                     label='Description'
                     disabled={loading}
                     fullWidth
                     multiline
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.description}
                  />
                  <TextField
                     name='youtube'
                     label='YouTube Embed Link'
                     disabled={loading}
                     fullWidth
                     margin="normal"
                     variant="outlined"
                     onChange={handleInputChange}
                     value={values.youtube}
                  />
                  <Button
                     type="submit"
                     disabled={loading}
                     fullWidth
                     variant="contained"
                     color="primary"
                     className={classes.submit}
                  >
                     Save
                  </Button>
               </form>
            </div>
         }
         {values == undefined && <Typography>There are no events to tag!</Typography>}
      </Container>
   );
};