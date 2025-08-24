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

import React, { useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import GameAddIcon from '@mui/icons-material/SportsEsportsOutlined';
import CreateGameIcon from '@mui/icons-material/AddCircleOutlined';
import JoinGameIcon from '@mui/icons-material/AddLinkOutlined';
import { TextPromptDialog } from './TextPromptDialog';

/**
 * The props required by the {@link EmptyCardContent} component.
 *
 * @internal
 */
export interface EmptyCardContentProps {
  /** A callback that will be called to create a new RPS game. */
  onCreateBoardCallback: () => void;
  /** A callback that will be called to join an existing RPS game. */
  onJoinBoardCallback: (contractAddress: ContractAddress) => void;
}

/**
 * Used when there is no game deployment to render a UI allowing the user to join or deploy RPS games.
 *
 * @internal
 */
export const EmptyCardContent: React.FC<Readonly<EmptyCardContentProps>> = ({
  onCreateBoardCallback,
  onJoinBoardCallback,
}) => {
  const [textPromptOpen, setTextPromptOpen] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  const handleJoinWithAddress = () => {
    if (contractAddress.trim()) {
      onJoinBoardCallback(contractAddress.trim() as ContractAddress);
      setContractAddress('');
    }
  };

  return (
    <React.Fragment>
      <CardContent>
        <Typography align="center" variant="h1" color="primary.dark">
          <GameAddIcon fontSize="large" />
        </Typography>
        <Typography data-testid="rps-game-message" align="center" variant="body2" color="primary.dark" sx={{ mb: 2 }}>
          Create a new Rock Paper Scissors game, or join an existing one...
        </Typography>
        
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
          Join existing game:
        </Typography>
        <input
          type="text"
          placeholder="Enter contract address (0x...)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleJoinWithAddress}
          disabled={!contractAddress.trim()}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: contractAddress.trim() ? '#1976d2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: contractAddress.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            marginBottom: '16px'
          }}
        >
          Join Game
        </button>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <Tooltip title="Create a new game">
          <IconButton data-testid="rps-deploy-btn" onClick={onCreateBoardCallback}>
            <CreateGameIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Join with dialog">
          <IconButton
            data-testid="rps-join-btn"
            onClick={() => {
              setTextPromptOpen(true);
            }}
          >
            <JoinGameIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      <TextPromptDialog
        prompt="Enter contract address"
        isOpen={textPromptOpen}
        onCancel={() => {
          setTextPromptOpen(false);
        }}
        onSubmit={(text) => {
          setTextPromptOpen(false);
          onJoinBoardCallback(text);
        }}
      />
    </React.Fragment>
  );
};
