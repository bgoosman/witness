import React, { useState, useEffect, SyntheticEvent, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
  Slider,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TimelineEventData } from "../models/timeline-event";
import { EventStore } from "../stores/event-store";
import RefreshIcon from "@material-ui/icons/Refresh";
import DateFnsUtils from "@date-io/dayjs";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import * as cityTimeZones from "city-timezones";
import dayjs, { Dayjs } from "dayjs";
import dayjsPluginUTC from "dayjs/plugin/utc";
import dayjsPluginTimezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { reaction } from "mobx";
dayjs.extend(dayjsPluginUTC);
dayjs.extend(dayjsPluginTimezone);
dayjs.extend(customParseFormat);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1rem",
    "& p": {
      padding: "1rem",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const defaultEvent: TimelineEventData = {
  id: "",
  doucetteId: "",
  groupId: "",
  sourceLink: "",
  youtubeEmbedLink: "",
  date: "",
  time: "",
  timeRelative: 0,
  city: "",
  state: "",
  description: "",
  isTagged: false,
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
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null);
  const [
    selectedDate,
    setSelectedDate,
  ] = useState<MaterialUiPickersDate | null>(null);
  const [
    selectedTime,
    setSelectedTime,
  ] = useState<MaterialUiPickersDate | null>(null);
  const [useRelativeTime, toggleRelativeTime] = useState<boolean>(false);
  const [isFormValid, toggleFormValid] = useState<boolean>(false);

  useEffect(() => {
    fetchUntaggedEvent();
  }, []);

  useEffect(() => {
    toggleFormValid(validateForm());
  }, [values]);

  const clearState = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    toggleRelativeTime(false);
    setValues(defaultEvent);
  };

  const getDetectedTimezone = (city: string, state: string) => {
    if (city === "" || state === "") return null;
    const search = `${city} ${state} United States of America`;
    console.log(search);
    const tz = cityTimeZones.findFromCityStateProvince(search);
    console.log(tz);
    return tz && tz.length > 0 ? tz[0].timezone : null;
  };

  const handleInputChange = (e: FormEvent) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === "city") {
      setDetectedTimezone(getDetectedTimezone(value, values.state));
    } else if (name === "state") {
      setDetectedTimezone(getDetectedTimezone(values.city, value));
    }
  };

  const handleTimeRelativeChange = (
    e: ChangeEvent<{}>,
    value: number[] | number
  ): void => {
    setValues({
      ...values,
      timeRelative: value as number,
    });
  };

  const handleRelativeTimeCheckbox = (e: ChangeEvent<{}>, checked: boolean) => {
    toggleRelativeTime(checked);
    setValues({
      ...values,
      time: null,
    });
  };

  const handleSkip = (event: SyntheticEvent) => {
    fetchUntaggedEvent();
  };

  const parseEventDate = (date: string): Dayjs => dayjs(date, "YYYY-MM-DD");
  const parseEventTime = (time: string): Dayjs => dayjs(time, "HH:mm");
  const handleEvent = (event: TimelineEventData): void => {
    if (event) {
      console.log(event);
      setSelectedDate(event.date ? parseEventDate(event.date) : null);
      setSelectedTime(event.time ? parseEventTime(event.time) : null);
      setDetectedTimezone(getDetectedTimezone(event.city, event.state));
      if (!event.time && event.timeRelative) toggleRelativeTime(true);
      setValues(event);
    } else {
      setValues(defaultEvent);
    }
  };
  const fetchUntaggedEvent = () => {
    setLoading(true);
    clearState();
    eventStore
      .getUntaggedEvent()
      .then(handleEvent)
      .finally(() => {
        setLoading(false);
      });
  };

  const serializeDate = (date: Dayjs): string => date.format("YYYY-MM-DD");
  const handleDateChange = (newDate: MaterialUiPickersDate): void => {
    if (newDate) {
      setSelectedDate(newDate);
      setValues({
        ...values,
        date: serializeDate(newDate),
      });
    }
  };

  const serializeTime = (time: Dayjs): string => time.format("HH:mm");
  const getTimeRelative = (time: Dayjs): number =>
    (time.hour() * 60 * 60 + time.minute() * 60 + time.second()) / 86400.0;
  const handleTimeChange = (newTime: MaterialUiPickersDate): void => {
    if (newTime) {
      setSelectedTime(newTime);
      setValues({
        ...values,
        time: serializeTime(newTime),
        timeRelative: getTimeRelative(newTime),
      });
    }
  };

  const validateForm = (): boolean => {
    console.log("Validating form");
    if (!values.city) return false;
    if (!values.state) return false;
    if (!values.date) return false;
    if (!useRelativeTime && (!values.time || !detectedTimezone)) return false;
    if (!values.description) return false;
    return true;
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      console.log(values);
      eventStore
        .putEvent(values)
        .then(() => {
          fetchUntaggedEvent();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Form is not valid!");
    }
  };

  const marks = [
    // {
    //   value: 0,
    //   label: "12am",
    // },
    // {
    //   value: 0.125,
    //   label: "3am",
    // },
    {
      value: 0.25,
      label: "6am",
    },
    // {
    //   value: 0.375,
    //   label: "9am",
    // },
    {
      value: 0.5,
      label: "12pm",
    },
    // {
    //   value: 0.625,
    //   label: "3pm",
    // },
    {
      value: 0.75,
      label: "6pm",
    },
    // {
    //   value: 0.875,
    //   label: "9pm",
    // },
    // {
    //   value: 1,
    //   label: "12am",
    // },
  ];

  return (
    <Container component="main" maxWidth="xs">
      {
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
              name="sourceLink"
              label="Twitter Link"
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
              onChange={handleInputChange}
              value={values.sourceLink}
            />
            <TextField
              name="city"
              label="City"
              disabled={loading}
              error={!values.city}
              helperText={!values.city && "City is required"}
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={handleInputChange}
              required
              value={values.city}
            />
            <TextField
              name="state"
              label="State"
              disabled={loading}
              error={!values.state}
              helperText={!values.city && "State is required"}
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={handleInputChange}
              required
              value={values.state}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                disabled={loading}
                fullWidth
                format="MMMM D, YYYY"
                label="Date"
                defaultValue=""
                value={selectedDate}
                required={true}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <FormControlLabel
                control={<Switch />}
                label="I don't know the exact time"
                onChange={handleRelativeTimeCheckbox}
                checked={useRelativeTime}
              />
              {!useRelativeTime && (
                <>
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    disabled={loading}
                    error={!selectedTime}
                    helperText={!selectedTime && "Time is a required field"}
                    label="Time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    fullWidth
                    required
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    contentEditable={false}
                    label="Timezone"
                    error={!detectedTimezone}
                    fullWidth
                    helperText={
                      !detectedTimezone &&
                      "Could not detect timezone from city / state"
                    }
                    margin="normal"
                    value={detectedTimezone || "..."}
                    variant="filled"
                  />
                </>
              )}
            </MuiPickersUtilsProvider>
            {useRelativeTime && (
              <Box my={2}>
                <Typography id="approximate-time" gutterBottom>
                  Approximate time
                </Typography>
                <Slider
                  aria-labelledby="approximate-time"
                  step={0.00001}
                  min={0}
                  max={1}
                  marks={marks}
                  name="timeRelative"
                  onChange={handleTimeRelativeChange}
                  value={values.timeRelative}
                />
              </Box>
            )}
            <TextField
              name="description"
              label="Description"
              disabled={loading}
              fullWidth
              multiline
              margin="normal"
              variant="outlined"
              onChange={handleInputChange}
              value={values.description}
            />
            <TextField
              name="youtubeEmbedLink"
              label="YouTube Embed Link"
              disabled={loading}
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={handleInputChange}
              value={values.youtubeEmbedLink}
            />
            <Button
              type="submit"
              disabled={loading || !isFormValid}
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
      {values == undefined && (
        <Typography>There are no events to tag!</Typography>
      )}
    </Container>
  );
};
