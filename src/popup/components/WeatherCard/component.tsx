import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  CardContent,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import {
  OpenWeatherData,
  OpenweatherTempScale,
  fetchOpenWeatherData,
} from '../../../utils/api';

type WeatherCardContainerProps = {
  children: React.ReactNode;
  onDelete?: () => void;
};

const WeatherCardContainer: React.FC<WeatherCardContainerProps> = ({
  children,
  onDelete,
}) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button color='secondary' onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

type WeatherCardState = 'loading' | 'error' | 'ready';

type WeatherCardProps = {
  city: string;
  tempScale: OpenweatherTempScale;
  onDelete?: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  tempScale,
  onDelete,
}) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>('loading');

  // 際レンダリングされる場合でも、依存配列の変数に変化がない場合は再実行はされない
  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then((data) => {
        setWeatherData(data);
        setCardState('ready');
      })
      .catch((e) => {
        console.error(e);
        setCardState('error');
      });
  }, [city, tempScale]);

  if (cardState === 'loading') {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography variant='body1'>Loading...</Typography>
      </WeatherCardContainer>
    );
  }

  if (cardState === 'error') {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography variant='body1'>
          Error: could not retrieve weather data for this city.
        </Typography>
      </WeatherCardContainer>
    );
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Typography variant='h5'>{weatherData.name}</Typography>
      <Typography variant='body1'>
        {Math.round(weatherData.main.temp)}
      </Typography>
      <Typography variant='body1'>
        feels_like: {Math.round(weatherData.main.feels_like)}
      </Typography>
    </WeatherCardContainer>
  );
};

export default WeatherCard;
