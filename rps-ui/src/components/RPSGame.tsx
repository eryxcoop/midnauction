// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useCallback, useEffect, useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import {
  Backdrop,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import WriteIcon from '@mui/icons-material/EditNoteOutlined';
import CopyIcon from '@mui/icons-material/ContentPasteOutlined';
import StopIcon from '@mui/icons-material/HighlightOffOutlined';
import RestartIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompareIcon from '@mui/icons-material/Compare';
import { type RPSDerivedState, type DeployedRPSAPI } from '../../../api/src/index';
import { useDeployedRPSContext } from '../hooks';
import { type RPSDeployment } from '../contexts';
import { type Observable } from 'rxjs';
import { GAME_STATE, PLAY } from '../../../contract/src/index';
import { EmptyCardContent } from './Board.EmptyCardContent';
import { stringToBytes32 } from '../../../contract/src/test/utils';

// Helper function to convert Uint8Array to string
const bytes32ToString = (bytes: Uint8Array): string => {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const decoded = decoder.decode(bytes);
    // Remove null bytes and trim
    return decoded.replace(/\0+$/, '').trim();
  } catch {
    // If decoding fails, return hex representation
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

// Helper function to format encrypted play value
const formatEncryptedPlay = (bytes: Uint8Array): string => {
  // Show first 8 characters of hex representation for encrypted values
  const hex = Array.from(bytes.slice(0, 4))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${hex}...`;
};

/** The props required by the {@link RPSGame} component. */
export interface RPSGameProps {
  /** The observable RPS deployment. */
  rpsDeployment$?: Observable<RPSDeployment>;
}

/**
 * Provides the UI for a deployed Rock Paper Scissors contract; allowing players to make moves,
 * reveal them, and determine the winner following the rules enforced by the underlying Compact contract.
 *
 * @remarks
 * With no `rpsDeployment$` observable, the component will render a UI that allows the user to create
 * or join RPS games. It requires a `<DeployedRPSProvider />` to be in scope in order to manage
 * these additional games. It does this by invoking the `resolve(...)` method on the currently in-
 * scope `DeployedRPSContext`.
 *
 * When a `rpsDeployment$` observable is received, the component begins by rendering a skeletal view of
 * itself, along with a loading background. It does this until the game deployment receives a
 * `DeployedRPSAPI` instance, upon which it will then subscribe to its `state$` observable in order
 * to start receiving the changes in the game state.
 */
export const RPSGame: React.FC<Readonly<RPSGameProps>> = ({ rpsDeployment$ }) => {
  const rpsApiProvider = useDeployedRPSContext();
  const [rpsDeployment, setRpsDeployment] = useState<RPSDeployment>();
  const [deployedRPSAPI, setDeployedRPSAPI] = useState<DeployedRPSAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [gameState, setGameState] = useState<RPSDerivedState>();
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedPlay, setSelectedPlay] = useState<PLAY | null>(null);
  const [isWorking, setIsWorking] = useState(!!rpsDeployment$);

  // Two simple callbacks that call `resolve(...)` to either deploy or join an RPS game
  // contract. Since the `DeployedRPSContext` will create a new game and update the UI, we
  // don't have to do anything further once we've called `resolve`.
  const onCreateGame = useCallback(() => rpsApiProvider.resolve(), [rpsApiProvider]);
  const onJoinGame = useCallback(
    (contractAddress: ContractAddress) => rpsApiProvider.resolve(contractAddress),
    [rpsApiProvider],
  );

  // Callbacks to handle game actions
  const onChooseEncryptedA = useCallback(async () => {
    if (selectedPlay === null || selectedPlay === undefined || !playerName) {
      return;
    }

    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.choose_encrypted_a(selectedPlay, stringToBytes32(playerName));
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI, selectedPlay, playerName]);

  const onChooseEncryptedB = useCallback(async () => {
    if (selectedPlay === null || selectedPlay === undefined || !playerName) {
      return;
    }

    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.choose_encrypted_b(selectedPlay, stringToBytes32(playerName));
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI, selectedPlay, playerName]);

  const onMoveToReveal = useCallback(async () => {
    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.move_to_reveal();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI]);

  const onRevealA = useCallback(async () => {
    if (selectedPlay === null || selectedPlay === undefined || !playerName) {
      return;
    }

    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.reveal_a(selectedPlay, stringToBytes32(playerName));
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI, selectedPlay, playerName]);

  const onRevealB = useCallback(async () => {
    if (selectedPlay === null || selectedPlay === undefined || !playerName) {
      return;
    }

    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.reveal_b(selectedPlay, stringToBytes32(playerName));
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI, selectedPlay, playerName]);

  const onCompareAndResolve = useCallback(async () => {
    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.compare_and_resolve();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI]);

  const onRestartGame = useCallback(async () => {
    try {
      if (deployedRPSAPI) {
        setIsWorking(true);
        await deployedRPSAPI.restart_game();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedRPSAPI]);

  const onCopyContractAddress = useCallback(async () => {
    if (deployedRPSAPI) {
      await navigator.clipboard.writeText(deployedRPSAPI.deployedContractAddress);
    }
  }, [deployedRPSAPI]);

  // Subscribes to the `rpsDeployment$` observable so that we can receive updates on the deployment.
  useEffect(() => {
    if (!rpsDeployment$) {
      return;
    }

    const subscription = rpsDeployment$.subscribe(setRpsDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [rpsDeployment$]);

  // Subscribes to the `state$` observable on a `DeployedRPSAPI` if we receive one, allowing the
  // component to receive updates to the change in contract state; otherwise we update the UI to
  // reflect the error was received instead.
  useEffect(() => {
    if (!rpsDeployment) {
      return;
    }
    if (rpsDeployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (rpsDeployment.status === 'failed') {
      setErrorMessage(
        rpsDeployment.error.message.length ? rpsDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }

    // We need the RPS API as well as subscribing to its `state$` observable, so that we can invoke
    // the game methods later.
    setDeployedRPSAPI(rpsDeployment.api);
    const subscription = rpsDeployment.api.state$.subscribe(setGameState);
    return () => {
      subscription.unsubscribe();
    };
  }, [rpsDeployment, setIsWorking, setErrorMessage, setDeployedRPSAPI]);

  const getGameStateText = (state: GAME_STATE) => {
    switch (state) {
      case GAME_STATE.deciding:
        return 'Deciding Phase';
      case GAME_STATE.proving:
        return 'Reveal Phase';
      case GAME_STATE.finished:
        return 'Game Finished';
      default:
        return 'Unknown State';
    }
  };

  const getPlayText = (play: PLAY) => {
    switch (play) {
      case PLAY.rock:
        return 'Rock';
      case PLAY.paper:
        return 'Paper';
      case PLAY.scissors:
        return 'Scissors';
      default:
        return 'Unknown';
    }
  };

  // Check if play button should be disabled
  const isPlayDisabled = selectedPlay === null || selectedPlay === undefined || playerName.trim() === '';

  return (
    <Card 
      sx={{ 
        position: 'relative', 
        width: 400, 
        height: 600, 
        minWidth: 400, 
        minHeight: 600,
        paddingTop: errorMessage ? '100px' : '0'
      }} 
      color="primary"
    >
      {!rpsDeployment$ && (
        <EmptyCardContent onCreateBoardCallback={onCreateGame} onJoinBoardCallback={onJoinGame} />
      )}

      {rpsDeployment$ && (
        <React.Fragment>
          <Backdrop
            sx={{ position: 'absolute', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isWorking}
          >
            <CircularProgress data-testid="rps-working-indicator" />
          </Backdrop>
          {!!errorMessage && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: '#ff1744',
                color: 'white',
                p: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ⚠️ Error: {errorMessage}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setErrorMessage(undefined)}
                size="large"
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#ff1744', 
                  fontWeight: 'bold',
                  minWidth: '200px',
                  '&:hover': { backgroundColor: '#f5f5f5' } 
                }}
              >
                ✕ CLOSE ERROR & CONTINUE
              </Button>
            </Box>
          )}
          <CardHeader
            avatar={
              gameState ? (
                <LockOpenIcon data-testid="rps-unlocked-icon" />
              ) : (
                <Skeleton variant="circular" width={20} height={20} />
              )
            }
            titleTypographyProps={{ color: 'primary' }}
            title={toShortFormatContractAddress(deployedRPSAPI?.deployedContractAddress) ?? 'Loading...'}
            action={
              deployedRPSAPI?.deployedContractAddress ? (
                <IconButton title="Copy contract address" onClick={onCopyContractAddress}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              ) : (
                <Skeleton variant="circular" width={20} height={20} />
              )
            }
          />
          <CardContent>
            {gameState ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Game State: {getGameStateText(gameState.game_state)}
                </Typography>
                
                <TextField
                  fullWidth
                  label="Player Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  margin="normal"
                  size="small"
                />

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Select Your Move:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {[PLAY.rock, PLAY.paper, PLAY.scissors].map((play) => (
                    <Button
                      key={play}
                      variant={selectedPlay === play ? 'contained' : 'outlined'}
                      onClick={() => setSelectedPlay(play)}
                      size="small"
                    >
                      {getPlayText(play)}
                    </Button>
                  ))}
                </Box>

                {gameState.game_state === GAME_STATE.deciding && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Make Encrypted Moves:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={onChooseEncryptedA}
                        disabled={isPlayDisabled}
                        size="small"
                      >
                        Play as A
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={onChooseEncryptedB}
                        disabled={isPlayDisabled}
                        size="small"
                      >
                        Play as B
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={onMoveToReveal}
                      disabled={!gameState.encrypted_play_a.is_some || !gameState.encrypted_play_b.is_some}
                      sx={{ mt: 1 }}
                      size="small"
                    >
                      Move to Reveal Phase
                    </Button>
                  </Box>
                )}

                {gameState.game_state === GAME_STATE.proving && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Reveal Your Moves:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={onRevealA}
                        disabled={isPlayDisabled}
                        size="small"
                      >
                        Reveal A
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={onRevealB}
                        disabled={isPlayDisabled}
                        size="small"
                      >
                        Reveal B
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={onCompareAndResolve}
                      disabled={!gameState.clear_play_a.is_some || !gameState.clear_play_b.is_some}
                      sx={{ mt: 1 }}
                      size="small"
                    >
                      Compare & Resolve
                    </Button>
                  </Box>
                )}

                {gameState.game_state === GAME_STATE.finished && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Game Results:
                    </Typography>
                    <Chip 
                      label={`Winner: ${gameState.winner.length > 0 ? 'Determined' : 'Not set'}`}
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={onRestartGame}
                      size="small"
                    >
                      Restart Game
                    </Button>
                  </Box>
                )}

                {errorMessage && (
                  <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: 1, border: '1px solid red' }}>
                    <Typography variant="caption" sx={{ color: 'red', fontWeight: 'bold', display: 'block', mb: 1 }}>
                      ⚠️ Error: {errorMessage}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setErrorMessage(undefined)}
                      size="small"
                      fullWidth
                    >
                      ✕ Clear Error & Continue
                    </Button>
                  </Box>
                )}

                <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                    Public Ledger State:
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ color: '#333', fontWeight: 'bold', mb: 0.5 }}>
                    Encrypted Play A: {gameState.encrypted_play_a.is_some 
                      ? formatEncryptedPlay(gameState.encrypted_play_a.value)
                      : 'Not set'}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ color: '#333', fontWeight: 'bold', mb: 0.5 }}>
                    Encrypted Play B: {gameState.encrypted_play_b.is_some 
                      ? formatEncryptedPlay(gameState.encrypted_play_b.value)
                      : 'Not set'}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ color: '#333', fontWeight: 'bold', mb: 0.5 }}>
                    Clear Play A: {gameState.clear_play_a.is_some 
                      ? `${getPlayText(gameState.clear_play_a.value[0])} by ${bytes32ToString(gameState.clear_play_a.value[1])}`
                      : 'Not revealed'}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ color: '#333', fontWeight: 'bold', mb: 0.5 }}>
                    Clear Play B: {gameState.clear_play_b.is_some 
                      ? `${getPlayText(gameState.clear_play_b.value[0])} by ${bytes32ToString(gameState.clear_play_b.value[1])}`
                      : 'Not revealed'}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ color: '#333', fontWeight: 'bold' }}>
                    Winner: {bytes32ToString(gameState.winner)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Skeleton variant="rectangular" width={350} height={400} />
            )}
          </CardContent>
        </React.Fragment>
      )}
    </Card>
  );
};

/** @internal */
const toShortFormatContractAddress = (contractAddress: ContractAddress | undefined): React.ReactElement | undefined =>
  // Returns a new string made up of the first, and last, 8 characters of a given contract address.
  contractAddress ? (
    <span data-testid="rps-address">
      0x{contractAddress?.replace(/^[A-Fa-f0-9]{6}([A-Fa-f0-9]{8}).*([A-Fa-f0-9]{8})$/g, '$1...$2')}
    </span>
  ) : undefined; 