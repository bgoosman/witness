import React from "react";
import { Typography, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        border: '3px solid black',
        padding: '1rem 2rem',
        '& h3': {
            fontWeight: 800
        },
        textAlign: 'center'
    }
});

export const WitnessBanner = () => {
    const styles = useStyles();
    return (
        <Container className={styles.root}>
            <Typography variant="h3">WITNESS</Typography>
            <Typography variant="subtitle1">a citizen journalism database</Typography>
        </Container>
    );
}