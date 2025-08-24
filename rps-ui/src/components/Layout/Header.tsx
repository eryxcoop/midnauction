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

import React from 'react';
import { AppBar, Box, Typography } from '@mui/material';

/**
 * A simple application level header for the Rock Paper Scissors application.
 */
export const Header: React.FC = () => (
  <AppBar
    position="static"
    data-testid="header"
    sx={{
      backgroundColor: '#000',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        px: 10,
        py: 2.2,
        alignItems: 'center',
      }}
      data-testid="header-logo"
    >
      <img src="/midnight-logo.png" alt="logo-image" height={66} />
    </Box>
    <Box
      sx={{
        display: 'flex',
        px: 10,
        py: 2.2,
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
        Rock Paper Scissors
      </Typography>
    </Box>
  </AppBar>
);
