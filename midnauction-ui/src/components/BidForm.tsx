import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AttachMoney, Lock, Send } from '@mui/icons-material';
import { AuctionRound } from '../types';

interface BidFormProps {
  currentRound: AuctionRound;
  minimumBidValue: number;
  canSubmitBid: boolean;
  canRevealBid: boolean;
  hasSubmittedBid: boolean;
  isParticipant: boolean;
  onSubmitBid: (amount: number) => Promise<void>;
  onRevealBid: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function BidForm({
  currentRound,
  minimumBidValue,
  canSubmitBid,
  canRevealBid,
  hasSubmittedBid,
  isParticipant,
  onSubmitBid,
  onRevealBid,
  loading,
  error,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBidAmount(value);
    
    const numValue = parseFloat(value);
    if (value && numValue < minimumBidValue) {
      setBidError(`La oferta debe ser mayor a $${minimumBidValue}`);
    } else {
      setBidError('');
    }
  };

  const handleSubmitBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBidValue) {
      setBidError(`Por favor ingrese una cantidad válida mayor a $${minimumBidValue}`);
      return;
    }

    try {
      await onSubmitBid(amount);
      setBidAmount('');
      setBidError('');
    } catch (err) {
      setBidError(err instanceof Error ? err.message : 'Error al enviar la oferta');
    }
  };

  const handleRevealBid = async () => {
    try {
      await onRevealBid();
    } catch (err) {
      // Error handling is done in the context
    }
  };

  const getActiveStep = () => {
    if (currentRound === AuctionRound.BIDDING) return 0;
    if (currentRound === AuctionRound.REVEALING) return 1;
    return 2;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={3}>
          Participación en la Subasta
        </Typography>

        <Stepper activeStep={getActiveStep()} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Enviar Oferta Privada</StepLabel>
          </Step>
          <Step>
            <StepLabel>Revelar Oferta</StepLabel>
          </Step>
          <Step>
            <StepLabel>Resultados</StepLabel>
          </Step>
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Fase de Ofertas Privadas */}
        {currentRound === AuctionRound.BIDDING && (
          <Box>
            {canSubmitBid && !hasSubmittedBid && (
              <Box>
                <Typography variant="body1" mb={2}>
                  {!isParticipant 
                    ? "Ingrese su oferta para unirse a la subasta. Solo usted conocerá el monto hasta la fase de revelación."
                    : "Ingrese su oferta privada. Solo usted conocerá el monto hasta la fase de revelación."
                  }
                </Typography>
                
                <TextField
                  fullWidth
                  label="Monto de la Oferta"
                  type="number"
                  value={bidAmount}
                  onChange={handleBidChange}
                  error={!!bidError}
                  helperText={bidError || `Mínimo: ${formatCurrency(minimumBidValue)}`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmitBid}
                  disabled={loading || !!bidError || !bidAmount}
                  startIcon={<Lock />}
                  size="large"
                >
                  {loading 
                    ? 'Enviando Oferta...' 
                    : (!isParticipant ? 'Unirse con Oferta' : 'Enviar Oferta Privada')
                  }
                </Button>
              </Box>
            )}

            {hasSubmittedBid && (
              <Alert severity="success" icon={<Lock />}>
                ✓ Tu oferta privada ha sido enviada correctamente. 
                Espera a que comience la fase de revelación.
              </Alert>
            )}

            {!canSubmitBid && !hasSubmittedBid && (
              <Alert severity="warning">
                El período de ofertas ha terminado. Ya no se pueden enviar nuevas ofertas.
              </Alert>
            )}
          </Box>
        )}

        {/* Fase de Revelación */}
        {currentRound === AuctionRound.REVEALING && (
          <Box>
            {hasSubmittedBid ? (
              <Alert severity="info">
                <Typography variant="body1" mb={1}>
                  <strong>Fase de Revelación en Progreso</strong>
                </Typography>
                <Typography variant="body2">
                  El martillero está revelando las ofertas automáticamente. 
                  Tu oferta será revelada cuando el martillero lo decida.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning">
                No participaste en esta subasta. La fase de ofertas ya terminó.
              </Alert>
            )}
          </Box>
        )}

        {/* Subasta Finalizada */}
        {currentRound === AuctionRound.FINISHED && (
          <Alert severity="success">
            🎉 La subasta ha finalizado. Puedes ver los resultados finales arriba.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
